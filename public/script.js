class PersonManager {
    constructor() {
        this.apiBase = '/api/persons';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPersons();
    }

    bindEvents() {
        const form = document.getElementById('personForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(this.apiBase, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                alert('信息添加成功！');
                e.target.reset();
                this.loadPersons();
            } else {
                alert('添加失败: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('网络错误，请重试');
        }
    }

    async loadPersons() {
        const loading = document.getElementById('loading');
        const list = document.getElementById('personList');
        
        loading.style.display = 'block';
        list.innerHTML = '';

        try {
            const response = await fetch(this.apiBase);
            const result = await response.json();

            if (result.success) {
                this.renderPersons(result.data);
            } else {
                list.innerHTML = '<div class="empty-state">加载失败</div>';
            }
        } catch (error) {
            console.error('Error:', error);
            list.innerHTML = '<div class="empty-state">网络错误</div>';
        } finally {
            loading.style.display = 'none';
        }
    }

    renderPersons(persons) {
        const list = document.getElementById('personList');
        
        if (persons.length === 0) {
            list.innerHTML = '<div class="empty-state">暂无个人信息</div>';
            return;
        }

        list.innerHTML = persons.map(person => `
            <div class="person-card">
                <h3>${person.name} - ${person.gender}</h3>
                <div class="person-info">
                    <div class="info-item"><strong>QQ:</strong> ${person.qq || '未填写'}</div>
                    <div class="info-item"><strong>微信:</strong> ${person.wechat || '未填写'}</div>
                    <div class="info-item"><strong>电话:</strong> ${person.phone}</div>
                    <div class="info-item"><strong>地址:</strong> ${person.address || '未填写'}</div>
                </div>
                <div class="card-actions">
                    <button class="delete-btn" onclick="personManager.deletePerson('${person._id}')">
                        删除
                    </button>
                </div>
                <small>添加时间: ${new Date(person.createdAt).toLocaleString()}</small>
            </div>
        `).join('');
    }

    async deletePerson(id) {
        if (!confirm('确定要删除这条信息吗？')) return;

        try {
            const response = await fetch(this.apiBase, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id })
            });

            const result = await response.json();

            if (result.success) {
                alert('删除成功！');
                this.loadPersons();
            } else {
                alert('删除失败: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('网络错误，请重试');
        }
    }
}

// 初始化应用
const personManager = new PersonManager();