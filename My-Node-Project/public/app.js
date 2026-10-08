const state = {
  section: 'novels',
  records: [],
  authors: [],
  user: null,
  token: sessionStorage.getItem('novel-manager-token'),
  editing: null,
  loading: false,
};

const sectionConfig = {
  novels: {
    title: 'Tiểu thuyết',
    subtitle: 'Quản lý danh mục truyện trong thư viện của bạn.',
    countLabel: 'TỔNG TIỂU THUYẾT',
    tableTitle: 'Danh sách tiểu thuyết',
    endpoint: '/api/novels?limit=100&page=1',
    columns: ['TIỂU THUYẾT', 'TÁC GIẢ', 'TRẠNG THÁI', 'LƯỢT XEM', 'THAO TÁC'],
  },
  authors: {
    title: 'Tác giả',
    subtitle: 'Danh sách tác giả và hồ sơ sáng tác.',
    countLabel: 'TỔNG TÁC GIẢ',
    tableTitle: 'Danh sách tác giả',
    endpoint: '/api/authors',
    columns: ['TÁC GIẢ', 'TÀI KHOẢN', 'EMAIL', 'SỐ TRUYỆN', 'THAO TÁC'],
  },
  categories: {
    title: 'Thể loại',
    subtitle: 'Sắp xếp và quản lý các thể loại truyện.',
    countLabel: 'TỔNG THỂ LOẠI',
    tableTitle: 'Danh sách thể loại',
    endpoint: '/api/categories',
    columns: ['THỂ LOẠI', 'SLUG', 'MÔ TẢ', 'SỐ TRUYỆN', 'THAO TÁC'],
  },
};

const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body) headers.set('Content-Type', 'application/json');
  if (state.token) headers.set('Authorization', `Bearer ${state.token}`);
  const response = await fetch(path, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && state.token) {
      setToken(null);
      renderAccount();
    }
    throw new Error(body.message || `Máy chủ trả về lỗi ${response.status}`);
  }
  return body;
}

function setToken(token) {
  state.token = token;
  if (token) sessionStorage.setItem('novel-manager-token', token);
  else sessionStorage.removeItem('novel-manager-token');
}

function toast(message, kind = '') {
  const item = document.createElement('div');
  item.className = `toast ${kind}`;
  item.textContent = message;
  $('#toast-region').append(item);
  window.setTimeout(() => item.remove(), 4200);
}

function setApiStatus(connected) {
  $('#api-status').textContent = connected ? 'Đã kết nối' : 'Chưa kết nối';
  $('#api-stat').textContent = connected ? 'Online' : 'Offline';
  $('.status-dot').style.background = connected ? '#68c98e' : '#e48a73';
}

function renderAccount() {
  const account = $('#account');
  const signedIn = Boolean(state.user);
  account.innerHTML = signedIn
    ? `<span class="account-name">${escapeHtml(state.user.full_name || state.user.username)}<span class="account-role">${escapeHtml(state.user.role)}</span></span><span class="avatar">${escapeHtml((state.user.full_name || state.user.username || 'U').slice(0, 1).toUpperCase())}</span><button class="button button-quiet" id="logout-button" type="button">Đăng xuất</button>`
    : '<button class="button button-secondary" id="login-button" type="button">Đăng nhập</button>';
  $('#account-stat').textContent = signedIn ? (state.user.full_name || state.user.username) : 'Khách';
  $('#role-note').textContent = signedIn ? `Quyền ${state.user.role}` : 'Đăng nhập để quản lý';
  $('#logout-button')?.addEventListener('click', logout);
  $('#login-button')?.addEventListener('click', showLogin);
  updateCreateButton();
}

function mayEdit() {
  if (!state.user) return false;
  if (state.section === 'novels') return ['admin', 'author'].includes(state.user.role);
  return state.user.role === 'admin';
}

function updateCreateButton() {
  const config = sectionConfig[state.section];
  $('#create-label').textContent = `Thêm ${state.section === 'novels' ? 'tiểu thuyết' : state.section === 'authors' ? 'tác giả' : 'thể loại'}`;
  $('#create-button').disabled = !mayEdit() || state.loading;
  $('#create-button').title = !state.user ? 'Đăng nhập để thêm dữ liệu' : !mayEdit() ? 'Tài khoản không có quyền thêm mục này' : '';
}

async function loadSection() {
  state.loading = true;
  updateCreateButton();
  $('#empty-state').hidden = true;
  $('#result-count').textContent = 'Đang tải dữ liệu...';
  try {
    const result = await api(sectionConfig[state.section].endpoint);
    state.records = Array.isArray(result.data) ? result.data : [];
    setApiStatus(true);
    $('#table-description').textContent = state.token
      ? 'Dữ liệu được tải trực tiếp từ API.'
      : 'Đang ở chế độ xem. Đăng nhập để thêm, sửa hoặc xóa.';
    renderTable();
  } catch (error) {
    state.records = [];
    setApiStatus(false);
    showEmpty('Không tải được dữ liệu', `${error.message}. Kiểm tra kết nối cơ sở dữ liệu rồi thử lại.`);
    $('#result-count').textContent = 'Không thể tải dữ liệu';
  } finally {
    state.loading = false;
    updateCreateButton();
  }
}

function showEmpty(title, description) {
  $('#empty-title').textContent = title;
  $('#empty-description').textContent = description;
  $('#retry-button').hidden = false;
  $('#empty-state').hidden = false;
  $('#table-head').innerHTML = '';
  $('#table-body').innerHTML = '';
  $('#record-count').textContent = '0';
}

function actionButtons(record, canEdit) {
  if (!canEdit) return '<span class="cell-caption">Chỉ xem</span>';
  return `<div class="row-actions"><button class="row-button" data-action="edit" data-id="${escapeHtml(record.id)}" title="Chỉnh sửa" aria-label="Chỉnh sửa">✎</button><button class="row-button delete" data-action="delete" data-id="${escapeHtml(record.id)}" title="Xóa" aria-label="Xóa">×</button></div>`;
}

function renderNovel(record) {
  const cover = record.cover_image
    ? `<img class="cover" src="${escapeHtml(record.cover_image)}" alt="" loading="lazy" onerror="this.outerHTML='<span class=&quot;cover cover-placeholder&quot;>▤</span>'">`
    : '<span class="cover cover-placeholder">▤</span>';
  const statusLabels = { draft: 'Bản nháp', ongoing: 'Đang tiến hành', completed: 'Hoàn thành', hiatus: 'Tạm dừng' };
  return `<tr>
    <td><div class="primary-cell">${cover}<div><div class="cell-title">${escapeHtml(record.title)}</div><div class="cell-caption">${escapeHtml(record.slug)}</div></div></div></td>
    <td>${escapeHtml(record.pen_name || '—')}</td>
    <td><span class="pill status-${escapeHtml(record.status)}">${escapeHtml(statusLabels[record.status] || record.status)}</span></td>
    <td>${Number(record.total_views || 0).toLocaleString('vi-VN')}</td>
    <td>${actionButtons(record, mayEdit())}</td>
  </tr>`;
}

function renderAuthor(record) {
  const name = record.pen_name || record.full_name || 'Chưa có tên';
  return `<tr><td><div class="primary-cell"><span class="cover cover-placeholder">${escapeHtml(name.slice(0, 1).toUpperCase())}</span><div><div class="cell-title">${escapeHtml(name)}</div><div class="cell-caption">ID tác giả #${escapeHtml(record.id)}</div></div></div></td><td>${escapeHtml(record.username || record.user_id)}</td><td>${escapeHtml(record.email || '—')}</td><td>${Number(record.total_novels || 0).toLocaleString('vi-VN')}</td><td>${actionButtons(record, mayEdit())}</td></tr>`;
}

function renderCategory(record) {
  return `<tr><td><div class="primary-cell"><span class="cover cover-placeholder">${escapeHtml(record.icon || '▦')}</span><div><div class="cell-title">${escapeHtml(record.name)}</div><div class="cell-caption">ID thể loại #${escapeHtml(record.id)}</div></div></div></td><td><span class="pill">${escapeHtml(record.slug)}</span></td><td><span class="cell-caption">${escapeHtml(record.description || '—')}</span></td><td>${Number(record.novel_count || 0).toLocaleString('vi-VN')}</td><td>${actionButtons(record, mayEdit())}</td></tr>`;
}

function renderTable() {
  const config = sectionConfig[state.section];
  $('#table-head').innerHTML = `<tr>${config.columns.map((column) => `<th>${column}</th>`).join('')}</tr>`;
  const query = $('#search').value.trim().toLocaleLowerCase('vi');
  const visible = state.records.filter((record) => Object.values(record).some((value) => String(value ?? '').toLocaleLowerCase('vi').includes(query)));
  const rowRenderer = { novels: renderNovel, authors: renderAuthor, categories: renderCategory }[state.section];
  $('#table-body').innerHTML = visible.map(rowRenderer).join('');
  $('#record-count').textContent = state.records.length.toLocaleString('vi-VN');
  $('#result-count').textContent = `Hiển thị ${visible.length.toLocaleString('vi-VN')} / ${state.records.length.toLocaleString('vi-VN')} mục`;
  $('#empty-state').hidden = visible.length !== 0;
  if (!visible.length) {
    $('#empty-title').textContent = query ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu';
    $('#empty-description').textContent = query ? 'Thử tìm với từ khóa khác.' : 'Chưa có mục nào trong danh sách này.';
    $('#retry-button').hidden = Boolean(query);
  } else {
    $('#retry-button').hidden = true;
  }
}

function updateSection(section) {
  state.section = section;
  const config = sectionConfig[section];
  document.querySelectorAll('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.section === section));
  $('#breadcrumb-title').textContent = config.title;
  $('#page-title').textContent = config.title;
  $('#page-subtitle').textContent = config.subtitle;
  $('#table-title').textContent = config.tableTitle;
  $('#count-label').textContent = config.countLabel;
  $('#search').value = '';
  updateCreateButton();
  loadSection();
}

function inputField({ name, label, value = '', type = 'text', required = false, full = false, placeholder = '', hint = '', options = [] }) {
  const className = full ? 'field full' : 'field';
  const requiredMark = required ? ' <span aria-hidden="true">*</span>' : '';
  let control;
  if (type === 'textarea') {
    control = `<textarea id="field-${name}" name="${name}" placeholder="${escapeHtml(placeholder)}" ${required ? 'required' : ''}>${escapeHtml(value)}</textarea>`;
  } else if (type === 'select') {
    control = `<select id="field-${name}" name="${name}" ${required ? 'required' : ''}>${options.map((option) => `<option value="${escapeHtml(option.value)}" ${String(option.value) === String(value) ? 'selected' : ''}>${escapeHtml(option.label)}</option>`).join('')}</select>`;
  } else {
    control = `<input id="field-${name}" name="${name}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" ${required ? 'required' : ''} />`;
  }
  return `<div class="${className}"><label for="field-${name}">${label}${requiredMark}</label>${control}${hint ? `<span class="field-hint">${hint}</span>` : ''}</div>`;
}

function formMarkup(section, record) {
  if (section === 'novels') {
    const availableAuthors = state.user?.role === 'admin'
      ? state.authors
      : state.authors.filter((author) => Number(author.user_id) === Number(state.user?.id));
    if (!record && !availableAuthors.length) throw new Error('Không tìm thấy hồ sơ tác giả cho tài khoản này.');
    const fields = [];
    if (!record) fields.push(inputField({
      name: 'author_id', label: 'Tác giả', required: true, type: 'select',
      options: availableAuthors.map((author) => ({ value: author.id, label: `${author.pen_name} (#${author.id})` })),
    }));
    fields.push(
      inputField({ name: 'title', label: 'Tên tiểu thuyết', value: record?.title, required: true, full: !record, placeholder: 'Ví dụ: Hành trình phương Bắc' }),
      inputField({ name: 'slug', label: 'Slug', value: record?.slug, required: true, placeholder: 'hanh-trinh-phuong-bac' }),
      inputField({ name: 'status', label: 'Trạng thái', type: 'select', value: record?.status || 'draft', options: [
        { value: 'draft', label: 'Bản nháp' }, { value: 'ongoing', label: 'Đang tiến hành' },
        { value: 'completed', label: 'Hoàn thành' }, { value: 'hiatus', label: 'Tạm dừng' },
      ] }),
      inputField({ name: 'cover_image', label: 'URL ảnh bìa', value: record?.cover_image || '', type: 'url', full: true, placeholder: 'https://...' }),
      inputField({ name: 'description', label: 'Mô tả', value: record?.description || '', type: 'textarea', full: true, placeholder: 'Giới thiệu ngắn về tiểu thuyết...' }),
    );
    return fields.join('');
  }
  if (section === 'categories') {
    return [
      inputField({ name: 'name', label: 'Tên thể loại', value: record?.name, required: true, placeholder: 'Ví dụ: Kỳ ảo' }),
      inputField({ name: 'slug', label: 'Slug', value: record?.slug, required: true, placeholder: 'ky-ao' }),
      inputField({ name: 'icon', label: 'Biểu tượng', value: record?.icon || '📚', placeholder: '📚' }),
      inputField({ name: 'description', label: 'Mô tả', value: record?.description || '', type: 'textarea', full: true, placeholder: 'Mô tả thể loại...' }),
    ].join('');
  }
  const fields = [];
  if (!record) fields.push(inputField({ name: 'user_id', label: 'ID tài khoản', type: 'number', required: true, placeholder: 'Ví dụ: 2', hint: 'Tài khoản người dùng cần có vai trò tác giả.' }));
  fields.push(
    inputField({ name: 'pen_name', label: 'Bút danh', value: record?.pen_name, required: true, full: !record, placeholder: 'Bút danh tác giả' }),
    inputField({ name: 'avatar_url', label: 'URL ảnh đại diện', value: record?.avatar_url || '', type: 'url', full: true, placeholder: 'https://...' }),
    inputField({ name: 'bio', label: 'Tiểu sử', value: record?.bio || '', type: 'textarea', full: true, placeholder: 'Giới thiệu về tác giả...' }),
  );
  return fields.join('');
}

async function openModal(record = null) {
  if (!state.user) {
    showLogin();
    toast('Đăng nhập để thêm hoặc chỉnh sửa dữ liệu.');
    return;
  }
  state.editing = record;
  try {
    if (state.section === 'novels' && !record) {
      const result = await api('/api/authors');
      state.authors = result.data || [];
    }
    $('#form-fields').innerHTML = formMarkup(state.section, record);
  } catch (error) {
    toast(error.message, 'error');
    return;
  }
  $('#modal-title').textContent = `${record ? 'Chỉnh sửa' : 'Thêm'} ${state.section === 'novels' ? 'tiểu thuyết' : state.section === 'authors' ? 'tác giả' : 'thể loại'}`;
  $('#save-button').textContent = record ? 'Lưu thay đổi' : 'Tạo mới';
  $('#form-error').textContent = '';
  $('#modal').hidden = false;
  $('#form-fields input, #form-fields select, #form-fields textarea')[0]?.focus();
}

function closeModal() {
  $('#modal').hidden = true;
  $('#form-error').textContent = '';
  $('#record-form').reset();
  state.editing = null;
}

function slugify(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function saveRecord(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const payload = Object.fromEntries(formData.entries());
  if (state.section === 'novels' && !state.editing) {
    payload.author_id = Number(payload.author_id);
    payload.category_ids = [];
    payload.tag_ids = [];
  }
  if (state.section === 'authors' && !state.editing) payload.user_id = Number(payload.user_id);
  for (const key of ['description', 'bio', 'cover_image', 'avatar_url']) {
    if (payload[key] === '') payload[key] = null;
  }
  const endpoint = `/${state.section}${state.editing ? `/${encodeURIComponent(state.editing.id)}` : ''}`;
  const method = state.editing ? 'PUT' : 'POST';
  const saveButton = $('#save-button');
  saveButton.disabled = true;
  saveButton.textContent = 'Đang lưu...';
  try {
    const result = await api(`/api${endpoint}`, { method, body: JSON.stringify(payload) });
    closeModal();
    toast(result.message || 'Đã lưu dữ liệu thành công.', 'success');
    await loadSection();
  } catch (error) {
    $('#form-error').textContent = error.message;
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = state.editing ? 'Lưu thay đổi' : 'Tạo mới';
  }
}

async function deleteRecord(id) {
  const record = state.records.find((item) => String(item.id) === String(id));
  const label = record?.title || record?.name || record?.pen_name || `#${id}`;
  if (!window.confirm(`Xóa "${label}"? Thao tác này không thể hoàn tác.`)) return;
  try {
    const result = await api(`/api/${state.section}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    toast(result.message || 'Đã xóa dữ liệu thành công.', 'success');
    await loadSection();
  } catch (error) {
    toast(error.message, 'error');
  }
}

function showLogin() {
  state.editing = null;
  $('#modal-title').textContent = 'Đăng nhập';
  $('#form-fields').innerHTML = [
    inputField({ name: 'email', label: 'Email', type: 'email', required: true, full: true, placeholder: 'admin@example.com' }),
    inputField({ name: 'password', label: 'Mật khẩu', type: 'password', required: true, full: true, placeholder: 'Nhập mật khẩu' }),
  ].join('');
  $('#form-error').textContent = '';
  $('#save-button').textContent = 'Đăng nhập';
  $('#modal').hidden = false;
  $('#form-fields input')[0]?.focus();
}

async function submitLogin(event) {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
  const saveButton = $('#save-button');
  saveButton.disabled = true;
  saveButton.textContent = 'Đang đăng nhập...';
  try {
    const result = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
    setToken(result.token);
    state.user = result.data;
    renderAccount();
    closeModal();
    toast(`Xin chào ${state.user.full_name || state.user.username}!`, 'success');
    await loadSection();
  } catch (error) {
    $('#form-error').textContent = error.message;
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = 'Đăng nhập';
  }
}

async function logout() {
  setToken(null);
  state.user = null;
  renderAccount();
  await loadSection();
  toast('Bạn đã đăng xuất.');
}

async function restoreSession() {
  if (!state.token) return;
  try {
    const result = await api('/api/auth/me');
    state.user = result.data;
    renderAccount();
  } catch (error) {
    setToken(null);
    state.user = null;
    renderAccount();
    toast(`Phiên đăng nhập không còn hợp lệ: ${error.message}`, 'error');
  }
}

document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', () => updateSection(button.dataset.section));
});
$('#create-button').addEventListener('click', () => openModal());
$('#close-modal').addEventListener('click', closeModal);
$('#cancel-modal').addEventListener('click', closeModal);
$('#modal').addEventListener('click', (event) => { if (event.target === $('#modal')) closeModal(); });
$('#record-form').addEventListener('submit', (event) => {
  if ($('#modal-title').textContent === 'Đăng nhập') submitLogin(event);
  else saveRecord(event);
});
$('#form-fields').addEventListener('input', (event) => {
  if (event.target.name === 'title' && !$('#field-slug')?.dataset.touched) {
    $('#field-slug').value = slugify(event.target.value);
  }
  if (event.target.name === 'name' && !$('#field-slug')?.dataset.touched) {
    $('#field-slug').value = slugify(event.target.value);
  }
});
$('#form-fields').addEventListener('input', (event) => {
  if (event.target.name === 'slug') event.target.dataset.touched = 'true';
});
$('#form-fields').addEventListener('change', (event) => {
  if (event.target.name === 'slug') event.target.dataset.touched = 'true';
});
$('#table-body').addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const record = state.records.find((item) => String(item.id) === button.dataset.id);
  if (button.dataset.action === 'edit' && record) openModal(record);
  if (button.dataset.action === 'delete') deleteRecord(button.dataset.id);
});
$('#search').addEventListener('input', renderTable);
$('#refresh-button').addEventListener('click', loadSection);
$('#retry-button').addEventListener('click', loadSection);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    $('#search').focus();
  }
});

(async function init() {
  renderAccount();
  await restoreSession();
  await loadSection();
})();
