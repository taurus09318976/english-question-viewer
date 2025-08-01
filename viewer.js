class EnglishQuestionViewer {
    constructor() {
        this.currentData = null;
        this.quillInstances = new Map();
        this.fileList = [];
        this.filteredFileList = [];
        this.currentFileName = null;
        
        this.initializeFileList();
        this.initializeEventListeners();
        this.loadFileList();
    }

    // 파일 목록 초기화
    initializeFileList() {
        this.fileList = [
            'ENG_3353111026223547757', 'ENG_3353133883603289461', 'ENG_3353825430002992640',
            'ENG_3353847523407037955', 'ENG_3354448466901206640', 'ENG_3354449609773549169',
            'ENG_3354591338417882767', 'ENG_3354612027669612179', 'ENG_3356797865551726499',
            'ENG_3357300952108369901', 'ENG_3358156069980341284', 'ENG_3358178697378006053',
            'ENG_3387968156105443210', 'ENG_3391666443106911573', 'ENG_3395754082785298156',
            'ENG_3452231325593896705', 'ENG_3454058249005828006', 'ENG_3455267870248797185',
            'ENG_3456952390555534402', 'ENG_3457496685410780243', 'ENG_3457501119696077909',
            'ENG_3457578971095368791', 'ENG_3457581755333084249', 'ENG_3457586730205447259',
            'ENG_3457589973300020317', 'ENG_3457599418461586530', 'ENG_3458365006691697776',
            'ENG_3458368751685076082', 'ENG_3458371429798511732', 'ENG_3458374888035714166',
            'ENG_3458377970421335160', 'ENG_3458380884455982202', 'ENG_3458389069002703999',
            'ENG_3458505557785183367', 'ENG_3458540358948881545', 'ENG_3459835864413111453',
            'ENG_3459837182087267486', 'ENG_3459902955493262496', 'ENG_3459902986992485537',
            'ENG_3460591555839001811', 'ENG_3461248017909155055', 'ENG_3463348201141044685',
            'ENG_3465412218869254113', 'ENG_3472188852637009409', 'ENG_3472190476520523266',
            'ENG_3472753359641904661', 'ENG_3473522302954505797', 'ENG_3482273284777575623',
            'ENG_3483769332733838675', 'ENG_3484485764794811778', 'ENG_3484487293056583043',
            'ENG_3484488665818727812', 'ENG_3484489813187364229', 'ENG_3484490426688210310',
            'ENG_3484491102784849287', 'ENG_3484530760046609802', 'ENG_3484531363556623755',
            'ENG_3484532090010076556', 'ENG_3484532690886067597', 'ENG_3484533274775127438',
            'ENG_3484533842449008015', 'ENG_3485132258858239473', 'ENG_3487355445272643168',
            'ENG_3487357384408434274', 'ENG_3487381440545424996', 'ENG_3488116263077545578',
            'ENG_3489923340720670455', 'ENG_3492127195487274822', 'ENG_3493868923382663085',
            'ENG_3503043784940193213', 'ENG_3507339478463154035', 'ENG_3649713495940793753',
            'ENG_3654669979762034430', 'ENG_3661355641911379640', 'ENG_3661356077867337401',
            'ENG_3661386721997620922', 'ENG_3661737888128698080', 'ENG_3661754698639083233',
            'ENG_3661991803340457727', 'ENG_3662069056279676679', 'ENG_3662095223611197195',
            'ENG_3662515903746017188', 'ENG_3662539750461409200', 'ENG_3662566501505828785',
            'ENG_3662597489199941554', 'ENG_3662628146550671295', 'ENG_3662658745248253913',
            'ENG_3662683749776099315', 'ENG_3663498356216300613', 'ENG_3663591512647664721',
            'ENG_3664051705038767226', 'ENG_3664156658352784538', 'ENG_3664692863410635987',
            'ENG_3666844158540121561', 'ENG_3666844856942069210', 'ENG_3666845649522918875',
            'ENG_3666846209764492764', 'ENG_3666846878319773149', 'ENG_3666848321487504863',
            'ENG_3666848927371494880', 'ENG_3666849513668085217', 'ENG_3666850092104549858',
            'ENG_3666850797376767459', 'ENG_3671940044978915111', 'ENG_3671940772430612264',
            'ENG_3671941607508150057', 'ENG_3671943303441418026'
        ];
        this.filteredFileList = [...this.fileList];
    }

    initializeEventListeners() {
        // 검색 이벤트
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterFiles(e.target.value);
        });

        // 탭 전환 이벤트
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
    }

    // 파일 목록 표시
    loadFileList() {
        const fileListContainer = document.getElementById('fileList');
        fileListContainer.innerHTML = '';

        if (this.filteredFileList.length === 0) {
            fileListContainer.innerHTML = `
                <div class="empty-state">
                    <h3>검색 결과가 없습니다</h3>
                    <p>다른 키워드로 검색해보세요.</p>
                </div>
            `;
            return;
        }

        this.filteredFileList.forEach(fileName => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.dataset.fileName = fileName;
            
            // 파일명 표시 포맷팅
            const displayName = fileName.replace('ENG_', '').substring(0, 15) + '...';
            
            fileItem.innerHTML = `
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #333;">${displayName}</div>
                    <div style="font-size: 0.85rem; color: #666;">${fileName}</div>
                </div>
                <div style="color: #667eea;">📄</div>
            `;

            fileItem.addEventListener('click', () => {
                this.selectFile(fileName);
            });

            fileListContainer.appendChild(fileItem);
        });
    }

    // 파일 검색 필터링
    filterFiles(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredFileList = [...this.fileList];
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredFileList = this.fileList.filter(fileName => 
                fileName.toLowerCase().includes(term)
            );
        }
        this.loadFileList();
    }

    // 파일 선택
    async selectFile(fileName) {
        try {
            // 이전 활성 파일 비활성화
            document.querySelectorAll('.file-item').forEach(item => {
                item.classList.remove('active');
            });

            // 현재 파일 활성화
            const selectedItem = document.querySelector(`[data-file-name="${fileName}"]`);
            if (selectedItem) {
                selectedItem.classList.add('active');
            }

            // 로딩 상태 표시
            this.showLoading();

            // JSON 파일 로드
            const response = await fetch(`data/${fileName}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonData = await response.json();
            this.currentData = jsonData;
            this.currentFileName = fileName;

            // UI 업데이트
            this.updateFileInfo(fileName, jsonData);
            this.displayQuestions(jsonData);
            this.displayRawJson(jsonData);
            this.displayHtmlContent(jsonData);

        } catch (error) {
            console.error('파일 로드 오류:', error);
            this.showError(`파일을 불러오는 중 오류가 발생했습니다: ${error.message}`);
        }
    }

    // 로딩 상태 표시
    showLoading() {
        const questionsTab = document.getElementById('questionsTab');
        questionsTab.innerHTML = '<div class="loading">파일을 불러오는 중...</div>';
    }

    // 오류 메시지 표시
    showError(message) {
        const questionsTab = document.getElementById('questionsTab');
        questionsTab.innerHTML = `<div class="error">${message}</div>`;
    }

    // 파일 정보 업데이트
    updateFileInfo(fileName, data) {
        document.getElementById('currentFileName').textContent = fileName;
        
        let metaInfo = '';
        if (data.metadata) {
            const meta = data.metadata;
            metaInfo = `파일 크기: ${meta.fileSize || 'N/A'} | 페이지: ${meta.totalPages || 'N/A'}`;
        }
        
        document.getElementById('fileMeta').textContent = metaInfo;
    }

    // 문항 표시
    displayQuestions(data) {
        const questionsTab = document.getElementById('questionsTab');
        
        if (!data.annotations || data.annotations.length === 0) {
            questionsTab.innerHTML = `
                <div class="empty-state">
                    <h3>문항이 없습니다</h3>
                    <p>이 파일에는 표시할 문항이 없습니다.</p>
                </div>
            `;
            return;
        }

        questionsTab.innerHTML = '';

        data.annotations.forEach((annotation, index) => {
            if (annotation.data && annotation.data.text_segments) {
                const questionContainer = document.createElement('div');
                questionContainer.className = 'question-container';
                
                const questionHeader = document.createElement('div');
                questionHeader.className = 'question-header';
                questionHeader.innerHTML = `
                    <span class="question-number">문항 ${index + 1}</span>
                    <span class="question-type">${annotation.category || 'Unknown'}</span>
                `;
                
                questionContainer.appendChild(questionHeader);

                // 텍스트 세그먼트 처리
                annotation.data.text_segments.forEach(segment => {
                    if (segment.quill_delta && segment.quill_delta.ops) {
                        const sectionDiv = document.createElement('div');
                        sectionDiv.className = 'question-section';
                        
                        const titleDiv = document.createElement('div');
                        titleDiv.className = 'section-title';
                        titleDiv.textContent = segment.tag || '본문';
                        sectionDiv.appendChild(titleDiv);

                        const quillContainer = document.createElement('div');
                        const quillId = `quill-${index}-${segment.tag || 'content'}`;
                        quillContainer.id = quillId;
                        quillContainer.className = 'quill-container';
                        sectionDiv.appendChild(quillContainer);

                        questionContainer.appendChild(sectionDiv);

                        // Quill 인스턴스 생성
                        setTimeout(() => {
                            try {
                                const quill = new Quill(`#${quillId}`, {
                                    readOnly: true,
                                    theme: 'snow',
                                    modules: {
                                        toolbar: false
                                    }
                                });

                                quill.setContents(segment.quill_delta);
                                this.quillInstances.set(quillId, quill);
                            } catch (error) {
                                console.warn(`Quill 초기화 오류 (${quillId}):`, error);
                                document.getElementById(quillId).innerHTML = `
                                    <div class="error">Quill 렌더링 오류: ${error.message}</div>
                                `;
                            }
                        }, 100);
                    }
                });

                questionsTab.appendChild(questionContainer);
            }
        });
    }

    // 원본 JSON 표시
    displayRawJson(data) {
        const rawJson = document.getElementById('rawJson');
        rawJson.textContent = JSON.stringify(data, null, 2);
    }

    // HTML 콘텐츠 표시
    displayHtmlContent(data) {
        const htmlContent = document.getElementById('htmlContent');
        htmlContent.innerHTML = '';

        if (!data.annotations || data.annotations.length === 0) {
            htmlContent.innerHTML = '<p>HTML로 표시할 콘텐츠가 없습니다.</p>';
            return;
        }

        data.annotations.forEach((annotation, index) => {
            if (annotation.data && annotation.data.text_segments) {
                const questionDiv = document.createElement('div');
                questionDiv.style.marginBottom = '30px';
                questionDiv.style.border = '1px solid #ddd';
                questionDiv.style.borderRadius = '8px';
                questionDiv.style.padding = '20px';

                const titleH3 = document.createElement('h3');
                titleH3.textContent = `문항 ${index + 1}`;
                titleH3.style.color = '#667eea';
                titleH3.style.marginBottom = '15px';
                questionDiv.appendChild(titleH3);

                annotation.data.text_segments.forEach(segment => {
                    if (segment.quill_delta && segment.quill_delta.ops) {
                        const sectionDiv = document.createElement('div');
                        sectionDiv.style.marginBottom = '15px';

                        const sectionTitle = document.createElement('h4');
                        sectionTitle.textContent = segment.tag || '본문';
                        sectionTitle.style.color = '#333';
                        sectionTitle.style.marginBottom = '8px';
                        sectionDiv.appendChild(sectionTitle);

                        const contentDiv = document.createElement('div');
                        contentDiv.style.padding = '10px';
                        contentDiv.style.backgroundColor = '#f8f9fa';
                        contentDiv.style.borderRadius = '4px';
                        contentDiv.style.border = '1px solid #e9ecef';

                        // Delta를 HTML로 변환
                        let htmlText = this.deltaToHtml(segment.quill_delta);
                        contentDiv.innerHTML = htmlText;

                        sectionDiv.appendChild(contentDiv);
                        questionDiv.appendChild(sectionDiv);
                    }
                });

                htmlContent.appendChild(questionDiv);
            }
        });
    }

    // Delta를 HTML로 변환하는 간단한 함수
    deltaToHtml(delta) {
        if (!delta.ops) return '';

        let html = '';
        delta.ops.forEach(op => {
            if (typeof op.insert === 'string') {
                let text = op.insert;
                
                if (op.attributes) {
                    if (op.attributes.bold) text = `<strong>${text}</strong>`;
                    if (op.attributes.italic) text = `<em>${text}</em>`;
                    if (op.attributes.underline) text = `<u>${text}</u>`;
                    if (op.attributes.color) text = `<span style="color: ${op.attributes.color}">${text}</span>`;
                    if (op.attributes.background) text = `<span style="background-color: ${op.attributes.background}">${text}</span>`;
                }
                
                // 줄바꿈 처리 [[memory:4632543]]
                text = text.replace(/\n/g, '<br>');
                html += text;
            }
        });

        return html;
    }

    // 탭 전환
    switchTab(tabName) {
        // 탭 버튼 활성화 상태 변경
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // 탭 콘텐츠 표시/숨김
        document.querySelectorAll('.question-viewer').forEach(viewer => {
            viewer.classList.remove('active');
            viewer.style.display = 'none';
        });

        const activeTab = document.getElementById(`${tabName}Tab`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.style.display = 'block';
        }
    }
}

// 페이지 로드 시 뷰어 초기화
document.addEventListener('DOMContentLoaded', () => {
    new EnglishQuestionViewer();
}); 