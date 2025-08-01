class EnglishQuestionViewer {
    constructor() {
        this.currentData = null;
        this.quillInstances = new Map();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // 파일 입력 이벤트
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files);
        });

        // 탭 전환 이벤트
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // 드래그 앤 드롭 이벤트
        const fileInput = document.getElementById('fileInput');
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileInput.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            fileInput.addEventListener(eventName, this.highlight.bind(this), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            fileInput.addEventListener(eventName, this.unhighlight.bind(this), false);
        });

        fileInput.addEventListener('drop', this.handleDrop.bind(this), false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight(e) {
        e.target.classList.add('drag-over');
    }

    unhighlight(e) {
        e.target.classList.remove('drag-over');
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.handleFileSelection(files);
    }

    async handleFileSelection(files) {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        for (let file of files) {
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
                await this.addFileToList(file);
            }
        }
    }

    async addFileToList(file) {
        const fileList = document.getElementById('fileList');
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-icon">J</div>
            <div class="file-name">
                <div style="font-weight: 500;">${file.name}</div>
                <div style="font-size: 0.8rem; color: #666;">${this.formatFileSize(file.size)}</div>
            </div>
        `;

        fileItem.addEventListener('click', async () => {
            document.querySelectorAll('.file-item').forEach(item => item.classList.remove('active'));
            fileItem.classList.add('active');
            await this.loadFile(file);
        });

        fileList.appendChild(fileItem);

        // 첫 번째 파일을 자동으로 로드
        if (fileList.children.length === 1) {
            fileItem.click();
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async loadFile(file) {
        try {
            const text = await file.text();
            this.currentData = JSON.parse(text);
            
            // 파일 정보 업데이트
            document.getElementById('currentFileName').textContent = file.name;
            const meta = `${this.currentData.items?.length || 0}개 문항, ${this.currentData.annotations?.length || 0}개 주석`;
            document.getElementById('fileMeta').textContent = meta;

            // 현재 활성 탭에 따라 콘텐츠 업데이트
            const activeTab = document.querySelector('.tab.active').dataset.tab;
            this.switchTab(activeTab);

        } catch (error) {
            this.showError('파일을 읽는 중 오류가 발생했습니다: ' + error.message);
        }
    }

    switchTab(tabName) {
        // 탭 활성화 상태 변경
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // 탭 콘텐츠 표시/숨김
        document.querySelectorAll('.question-viewer').forEach(viewer => {
            viewer.classList.remove('active');
        });

        const targetTab = document.getElementById(tabName + 'Tab');
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // 데이터가 있을 때만 콘텐츠 업데이트
        if (!this.currentData) return;

        switch (tabName) {
            case 'questions':
                this.renderQuestions();
                break;
            case 'raw':
                this.renderRawJson();
                break;
            case 'html':
                this.renderHtmlContent();
                break;
        }
    }

    renderQuestions() {
        const container = document.getElementById('questionsTab');
        
        if (!this.currentData || !this.currentData.items) {
            container.innerHTML = '<div class="empty-state"><h3>문항 데이터가 없습니다</h3></div>';
            return;
        }

        container.innerHTML = '';
        
        this.currentData.items.forEach((item, index) => {
            const questionElement = this.createQuestionElement(item, index);
            container.appendChild(questionElement);
        });
    }

    createQuestionElement(item, index) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        
        // 문항 헤더
        const header = document.createElement('div');
        header.className = 'question-header';
        header.innerHTML = `
            <div class="question-number">문항 ${item.id || index + 1}</div>
            <div class="question-type">${item.answerType || 'Unknown'}</div>
        `;
        questionDiv.appendChild(header);

        // 지문 영역 (Passage)
        if (item.passageAreaInfo && item.passageAreaInfo.annotationIds.length > 0) {
            const passageSection = this.createQuestionSection('지문', item.passageAreaInfo.annotationIds);
            questionDiv.appendChild(passageSection);
        }

        // 문제 영역 (Question)
        if (item.questionAreaInfo && item.questionAreaInfo.annotationIds.length > 0) {
            const questionSection = this.createQuestionSection('문제', item.questionAreaInfo.annotationIds);
            questionDiv.appendChild(questionSection);
        }

        // 답안 영역 (Answer)
        if (item.answerAreaInfo && item.answerAreaInfo.annotationIds.length > 0) {
            const answerSection = this.createQuestionSection('답안', item.answerAreaInfo.annotationIds);
            questionDiv.appendChild(answerSection);
        }

        // 해설 영역 (Explanation)
        if (item.explanationAreaInfo && item.explanationAreaInfo.annotationIds.length > 0) {
            const explanationSection = this.createQuestionSection('해설', item.explanationAreaInfo.annotationIds);
            questionDiv.appendChild(explanationSection);
        }

        return questionDiv;
    }

    createQuestionSection(title, annotationIds) {
        const section = document.createElement('div');
        section.className = 'question-section';
        
        const titleElement = document.createElement('div');
        titleElement.className = 'section-title';
        titleElement.textContent = title;
        section.appendChild(titleElement);

        annotationIds.forEach(annotationId => {
            const annotation = this.findAnnotation(annotationId);
            if (annotation) {
                const contentDiv = this.createAnnotationContent(annotation);
                section.appendChild(contentDiv);
            }
        });

        return section;
    }

    findAnnotation(annotationId) {
        if (!this.currentData.annotations) return null;
        return this.currentData.annotations.find(ann => ann.id === annotationId);
    }

    createAnnotationContent(annotation) {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'annotation-content';
        
        // HTML이 있으면 HTML을 사용, 없으면 텍스트 사용
        if (annotation.html && annotation.html.trim()) {
            // HTML을 안전하게 표시
            contentDiv.innerHTML = this.sanitizeHtml(annotation.html);
        } else if (annotation.text && annotation.text.trim()) {
            // 텍스트를 Quill 에디터로 표시
            this.createQuillEditor(contentDiv, annotation.text);
        } else {
            contentDiv.innerHTML = '<em style="color: #999;">내용이 없습니다</em>';
        }

        return contentDiv;
    }

    createQuillEditor(container, text) {
        const editorId = 'editor-' + Math.random().toString(36).substr(2, 9);
        container.innerHTML = `<div id="${editorId}"></div>`;
        
        setTimeout(() => {
            const editorElement = document.getElementById(editorId);
            if (editorElement) {
                const quill = new Quill(editorElement, {
                    theme: 'snow',
                    readOnly: true,
                    modules: {
                        toolbar: false
                    }
                });

                // 텍스트를 Delta 형식으로 변환
                const delta = this.textToDelta(text);
                quill.setContents(delta);
                
                this.quillInstances.set(editorId, quill);
            }
        }, 0);
    }

    textToDelta(text) {
        // 간단한 텍스트를 Delta 형식으로 변환
        return {
            ops: [
                { insert: text }
            ]
        };
    }

    sanitizeHtml(html) {
        // 기본적인 HTML 태그만 허용
        const allowedTags = ['div', 'span', 'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'ul', 'ol', 'li'];
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // 허용되지 않은 태그 제거 (기본적인 구현)
        const walker = document.createTreeWalker(
            tempDiv,
            NodeFilter.SHOW_ELEMENT,
            null,
            false
        );

        const nodesToRemove = [];
        let node;
        while (node = walker.nextNode()) {
            if (!allowedTags.includes(node.tagName.toLowerCase())) {
                nodesToRemove.push(node);
            }
        }

        nodesToRemove.forEach(node => {
            if (node.parentNode) {
                // 태그는 제거하되 내용은 유지
                while (node.firstChild) {
                    node.parentNode.insertBefore(node.firstChild, node);
                }
                node.parentNode.removeChild(node);
            }
        });

        return tempDiv.innerHTML;
    }

    renderRawJson() {
        const container = document.getElementById('rawJson');
        if (this.currentData) {
            container.textContent = JSON.stringify(this.currentData, null, 2);
        } else {
            container.textContent = '데이터가 없습니다.';
        }
    }

    renderHtmlContent() {
        const container = document.getElementById('htmlContent');
        
        if (!this.currentData || !this.currentData.annotations) {
            container.innerHTML = '<div class="empty-state"><h3>HTML 데이터가 없습니다</h3></div>';
            return;
        }

        container.innerHTML = '';
        
        this.currentData.annotations.forEach(annotation => {
            if (annotation.html && annotation.html.trim()) {
                const htmlDiv = document.createElement('div');
                htmlDiv.style.marginBottom = '20px';
                htmlDiv.style.padding = '15px';
                htmlDiv.style.border = '1px solid #e9ecef';
                htmlDiv.style.borderRadius = '6px';
                htmlDiv.style.background = '#fafafa';
                
                const header = document.createElement('div');
                header.style.fontSize = '0.9rem';
                header.style.color = '#666';
                header.style.marginBottom = '10px';
                header.textContent = `Annotation ID: ${annotation.id}`;
                htmlDiv.appendChild(header);
                
                const content = document.createElement('div');
                content.innerHTML = this.sanitizeHtml(annotation.html);
                htmlDiv.appendChild(content);
                
                container.appendChild(htmlDiv);
            }
        });
    }

    showError(message) {
        const container = document.querySelector('.tab-content');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        container.insertBefore(errorDiv, container.firstChild);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// 페이지 로드 시 뷰어 초기화
document.addEventListener('DOMContentLoaded', () => {
    new EnglishQuestionViewer();
});

// 추가 스타일링을 위한 CSS 추가
const additionalStyles = `
    .drag-over {
        border-color: #667eea !important;
        background: #f0f4ff !important;
    }
    
    .annotation-content {
        margin-bottom: 15px;
        padding: 15px;
        background: #fafafa;
        border: 1px solid #e9ecef;
        border-radius: 6px;
    }
    
    .annotation-content:last-child {
        margin-bottom: 0;
    }
    
    .ql-container {
        border: none !important;
        font-size: 16px !important;
    }
    
    .ql-editor {
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
    }
    
    .ql-editor.ql-blank::before {
        font-style: italic;
        color: #999;
    }
`;

// 동적으로 스타일 추가
const styleSheet = document.createElement("style");
styleSheet.innerText = additionalStyles;
document.head.appendChild(styleSheet); 