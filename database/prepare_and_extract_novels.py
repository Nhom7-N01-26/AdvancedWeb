import os
import sys
import json
import shutil
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

# Source directory
RAW_DIR = r"E:\Downloads\Light novel & Web novel"
OUTPUT_DIR = r"E:\advancedWeb\Novel-Manager\data"
COVERS_DIR = os.path.join(OUTPUT_DIR, "covers")
CHAPTERS_DIR = os.path.join(OUTPUT_DIR, "chapters")

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(COVERS_DIR, exist_ok=True)
os.makedirs(CHAPTERS_DIR, exist_ok=True)

# Select 15 high-quality, representative novels with epub files
selected_folder_names = [
    "Akuma Koujo ~ Yurui Akuma no Monogatari ~",
    "Bluesteel Blasphemer",
    "Campione!(file epub là 10 vol đầu)",
    "Chuyển Sinh Thành Slime(only chap 92 trở đi)",
    "Chuyện kể của Vô Tận Hồi Quy Giả",
    "Căm hận ta đi,Ma nữ tiểu thư!",
    "Date A Bullet",
    "Dị thế Nhục hình Công chúa―Fremd Torturchen",
    "Eromanga sensei",
    "Hello, Hello and Hello",
    "Konosuba",
    "Sau Khi Nhặt Được Một Chú Mèo Đen, Nhà Tôi Bỗng Trở Thành Điểm Tụ Tập Của Hai Cô Gái Xinh Đẹp",
    "Shangri-La Frontier ~ Thợ săn game rác thách thức game thánh",
    "Thiên sứ nhà bên",
    "Vợ trong game của tôi là Idol ngoài đời thực"
]

print("=" * 60)
print(f"Bắt đầu chuẩn bị và trích xuất {len(selected_folder_names)} bộ truyện tiêu biểu...")
print("=" * 60)

# Import extraction logic from extract_novels.py
sys.path.insert(0, r"E:\advancedWeb\Novel-Manager")
from extract_novels import extract_epub, extract_pdf, extract_txt, clean_html, slugify, generate_id, count_words_vi

novels_data = []
authors_set = set()
categories_set = {"Hàn Quốc", "Nhật Bản", "Hành Động", "Huyễn Tưởng", "Học Viện", "Lãng Mạn", "Hài Hước", "Dị Giới", "Trọng Sinh"}

for folder_name in selected_folder_names:
    folder_path = os.path.join(RAW_DIR, folder_name)
    if not os.path.exists(folder_path):
        print(f"[Warning] Bo qua folder khong tim thay: {folder_name}")
        continue
    
    # Find all epub or pdf files in this folder
    files = []
    for root, dirs, fnames in os.walk(folder_path):
        for f in fnames:
            if f.lower().endswith(('.epub', '.pdf')):
                files.append(os.path.join(root, f))
    
    if not files:
        print(f"[Warning] Khong co file epub/pdf trong: {folder_name}")
        continue
    
    # Sort files and take the primary volume or first few volumes
    files.sort()
    chosen_file = files[0]
    
    print(f"\nDang xu ly: {folder_name} (File: {os.path.basename(chosen_file)})")
    
    try:
        novel = None
        if chosen_file.lower().endswith('.epub'):
            novel = extract_epub(chosen_file, COVERS_DIR)
        elif chosen_file.lower().endswith('.pdf'):
            novel = extract_pdf(chosen_file, COVERS_DIR)
        
        if novel and novel.get('chapters'):
            # Override or refine metadata from folder name
            clean_title = folder_name.split('(')[0].split('~')[0].strip()
            if clean_title:
                novel['title'] = clean_title
                novel['slug'] = slugify(clean_title)
            
            novel['id'] = generate_id(novel['title'] + novel['author'])
            novel['status'] = 'ongoing' if 'Đang tiến hành' in folder_name else 'completed'
            
            # Categorize
            cats = ["Nhật Bản", "Light Novel"]
            if any(k in clean_title.lower() for k in ["chuyển sinh", "dị thế", "hồi quy", "slime"]):
                cats.extend(["Dị Giới", "Trọng Sinh", "Hành Động"])
            elif any(k in clean_title.lower() for k in ["mèo đen", "vợ", "thiên sứ", "hôn", "idol", "eromanga"]):
                cats.extend(["Lãng Mạn", "Hài Hước", "Học Viện"])
            else:
                cats.extend(["Huyễn Tưởng", "Hành Động"])
            
            novel['categories'] = list(set(cats))
            for c in cats:
                categories_set.add(c)
                
            authors_set.add(novel['author'])
            novels_data.append(novel)
            print(f"  [OK] Thanh cong: {novel['title']} | Tac gia: {novel['author']} ({len(novel['chapters'])} chuong, {novel['total_words']:,} tu)")
        else:
            print(f"  [Fail] Khong boc tach duoc chuong nao tu: {chosen_file}")
    except Exception as e:
        print(f"  [Error] Loi khi doc {chosen_file}: {e}")

print("\n" + "=" * 60)
print(f"Hoan tat trich xuat: {len(novels_data)} bo truyen thanh cong!")
print("=" * 60)

# Save metadata json
novels_meta = []
for n in novels_data:
    # Save chapter json for each novel
    ch_filename = f"{n['slug']}_chapters.json"
    with open(os.path.join(CHAPTERS_DIR, ch_filename), 'w', encoding='utf-8') as f:
        json.dump({
            'novel_id': n['id'],
            'novel_title': n['title'],
            'total_chapters': len(n['chapters']),
            'chapters': n['chapters']
        }, f, ensure_ascii=False, indent=2)
        
    novels_meta.append({
        'id': n['id'],
        'title': n['title'],
        'slug': n['slug'],
        'author': n['author'],
        'description': n.get('description', f"Bộ truyện hấp dẫn {n['title']} của tác giả {n['author']}."),
        'cover_image': n.get('cover_image', ''),
        'status': n['status'],
        'language': 'vi',
        'total_chapters': len(n['chapters']),
        'total_words': n['total_words'],
        'categories': n['categories'],
        'avg_rating': 4.8,
        'total_views': 125000,
        'total_bookmarks': 1420
    })

# Save novels.json
with open(os.path.join(OUTPUT_DIR, 'novels.json'), 'w', encoding='utf-8') as f:
    json.dump({'total_novels': len(novels_meta), 'novels': novels_meta}, f, ensure_ascii=False, indent=2)

# Save categories.json
cat_list = [{'id': i, 'name': c, 'slug': slugify(c)} for i, c in enumerate(sorted(categories_set), 1)]
with open(os.path.join(OUTPUT_DIR, 'categories.json'), 'w', encoding='utf-8') as f:
    json.dump(cat_list, f, ensure_ascii=False, indent=2)

# Save authors.json
auth_list = [{'id': i, 'pen_name': a} for i, a in enumerate(sorted(authors_set), 1)]
with open(os.path.join(OUTPUT_DIR, 'authors.json'), 'w', encoding='utf-8') as f:
    json.dump(auth_list, f, ensure_ascii=False, indent=2)

# Save combined database_seed.json
with open(os.path.join(OUTPUT_DIR, 'database_seed.json'), 'w', encoding='utf-8') as f:
    json.dump({
        'novels': novels_meta,
        'categories': cat_list,
        'authors': auth_list
    }, f, ensure_ascii=False, indent=2)

print(f"\nĐã xuất toàn bộ dữ liệu vào:")
print(f" - {os.path.join(OUTPUT_DIR, 'novels.json')}")
print(f" - {os.path.join(OUTPUT_DIR, 'categories.json')}")
print(f" - {os.path.join(OUTPUT_DIR, 'authors.json')}")
print(f" - {os.path.join(OUTPUT_DIR, 'database_seed.json')}")
print(f" - {CHAPTERS_DIR} (Chứa chi tiết toàn bộ các chương)")
print(f" - {COVERS_DIR} (Chứa toàn bộ ảnh bìa gốc trích xuất từ truyện)")
