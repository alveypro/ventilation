// Vue应用
new Vue({
    el: '#app',
    data() {
        return {
            // 导航
            activeMenu: 'home',

            // 数据
            products: productsData,
            diseases: diseasesData,
            reviews: reviewsData,
            tutorials: tutorialsData,
            faqs: faqsData,
            brands: brandsData,
            productTypes: productTypesData,
            banners: bannersData,
            quickEntries: quickEntriesData,

            // 产品筛选
            productFilter: {
                brand: '',
                type: '',
                target: '',
                priceRange: ''
            },
            filteredProducts: [],

            // 产品对比
            compareList: [],
            showCompareDialog: false,

            // 当前查看的详情
            currentProduct: {},
            showProductDialog: false,
            currentReview: {},
            showReviewDialog: false,
            currentDisease: {},
            showDiseaseDialog: false,
            currentTutorial: {},
            showTutorialDialog: false,

            // 测评分类
            reviewTab: 'all',

            // 教程分类
            tutorialTab: 'beginner',

            // 智能选机
            selectorStep: 0,
            selectorAnswers: {
                purpose: '',
                ahiLevel: '',
                hasCentral: null,
                copdLevel: '',
                hasCO2Retention: null,
                severityLevel: '',
                scenarios: [],
                noiseSensitivity: '',
                features: [],
                budget: ''
            },
            recommendedProducts: []
        };
    },
    computed: {
        // 热门产品
        hotProducts() {
            return this.products.filter(p => p.tag).slice(0, 4);
        },
        // 最新测评
        latestReviews() {
            return this.reviews.slice(0, 3);
        },
        // 筛选后的测评
        filteredReviews() {
            if (this.reviewTab === 'all') {
                return this.reviews;
            }
            const categoryMap = {
                'single': '单品测评',
                'compare': '横向对比',
                'user': '用户评测'
            };
            return this.reviews.filter(r => r.category === categoryMap[this.reviewTab]);
        },
        // 筛选后的教程
        filteredTutorials() {
            if (this.tutorialTab === 'faq') {
                return this.tutorials.filter(t => t.category === 'faq');
            }
            return this.tutorials.filter(t => t.category === this.tutorialTab);
        },
        // 对比表格数据
        compareTableData() {
            if (this.compareList.length < 2) return [];

            const features = [
                { key: 'brand', name: '品牌' },
                { key: 'type', name: '类型' },
                { key: 'price', name: '价格', format: v => '¥' + v },
                { key: 'rating', name: '评分', format: v => v + '分' },
                { key: 'noise', name: '噪音', specKey: '噪音水平' },
                { key: 'weight', name: '重量', specKey: '重量' },
                { key: 'pressure', name: '压力范围', specKey: '压力范围' },
                { key: 'humidifier', name: '加湿器', specKey: '湿化器' },
                { key: 'data', name: '数据连接', specKey: '数据连接' }
            ];

            return features.map(f => {
                const row = { feature: f.name };
                this.compareList.forEach(p => {
                    if (f.specKey) {
                        row[p.id] = p.specs[f.specKey] || '-';
                    } else if (f.format) {
                        row[p.id] = f.format(p[f.key]);
                    } else {
                        row[p.id] = p[f.key] || '-';
                    }
                });
                return row;
            });
        }
    },
    created() {
        this.filteredProducts = this.products;
    },
    methods: {
        // 菜单选择
        handleMenuSelect(index) {
            this.activeMenu = index;
            window.scrollTo(0, 0);
        },

        // 产品筛选
        filterProducts() {
            let result = this.products;

            if (this.productFilter.brand) {
                result = result.filter(p => p.brand === this.productFilter.brand);
            }

            if (this.productFilter.type) {
                const typeMap = {
                    'cpap': '单水平CPAP',
                    'auto_cpap': '单水平全自动CPAP',
                    'bipap': '双水平自动BiPAP',
                    'bipap_st': '双水平无创呼吸机',
                    'portable': '便携',
                    'life_support': '生命支持'
                };
                result = result.filter(p => p.type.includes(typeMap[this.productFilter.type]) || p.type.includes(this.productFilter.type));
            }

            if (this.productFilter.target) {
                result = result.filter(p => p.suitableFor && p.suitableFor.includes(this.productFilter.target));
            }

            if (this.productFilter.priceRange) {
                const [min, max] = this.productFilter.priceRange.split('-').map(Number);
                result = result.filter(p => p.price >= min && p.price <= max);
            }

            this.filteredProducts = result;
        },

        // 重置筛选
        resetProductFilter() {
            this.productFilter = {
                brand: '',
                type: '',
                target: '',
                priceRange: ''
            };
            this.filteredProducts = this.products;
        },

        // 查看产品详情
        viewProductDetail(product) {
            this.currentProduct = product;
            this.showProductDialog = true;
        },

        // 根据ID查看产品
        viewProductById(id) {
            const product = this.products.find(p => p.id === id);
            if (product) {
                this.viewProductDetail(product);
            }
        },

        // 获取产品名称
        getProductName(id) {
            const product = this.products.find(p => p.id === id);
            return product ? product.name : '';
        },

        // 添加到对比
        addToCompare(product) {
            if (this.compareList.length >= 4) {
                this.$message.warning('最多只能对比4个产品');
                return;
            }
            if (this.compareList.find(p => p.id === product.id)) {
                this.$message.warning('该产品已在对比列表中');
                return;
            }
            this.compareList.push(product);
            this.$message.success('已添加到对比');
        },

        // 从对比中移除
        removeFromCompare(product) {
            const index = this.compareList.findIndex(p => p.id === product.id);
            if (index > -1) {
                this.compareList.splice(index, 1);
            }
        },

        // 清空对比
        clearCompare() {
            this.compareList = [];
        },

        // 格式化规格参数
        formatSpecs(specs) {
            if (!specs) return [];
            return Object.entries(specs).map(([name, value]) => ({ name, value }));
        },

        // 获取适用人群名称
        getSuitableName(key) {
            const map = {
                'sleep_apnea': '睡眠呼吸暂停',
                'copd': '慢阻肺/肺病',
                'heart_failure': '心力衰竭',
                'neuromuscular': '神经肌肉疾病'
            };
            return map[key] || key;
        },

        // 查看测评详情
        viewReviewDetail(review) {
            this.currentReview = review;
            this.showReviewDialog = true;
        },

        // 获取评分名称 - 三维度体系
        getScoreName(key) {
            const map = {
                // 临床效果维度
                'ahiControl': 'AHI控制',
                'oxygenImprovement': '血氧改善',
                'leakCompensation': '漏气补偿',
                'eventDetection': '事件检测',
                // 用户体验维度
                'comfort': '舒适度',
                'noise': '静音表现',
                'easeOfUse': '易用性',
                'sleepQuality': '睡眠改善',
                'portability': '便携性',
                // 技术质量维度
                'algorithm': '算法性能',
                'buildQuality': '做工品质',
                'reliability': '稳定可靠',
                'dataManagement': '数据管理',
                'humidification': '加湿系统',
                // 横评指标
                'comprehensiveness': '全面性',
                'objectivity': '客观性',
                'practicality': '实用性',
                // 兼容旧数据
                'design': '外观设计',
                'performance': '性能表现',
                'value': '性价比',
                'battery': '电池续航'
            };
            return map[key] || key;
        },

        // 获取维度名称
        getDimensionName(dimension) {
            const map = {
                'clinicalScores': '临床效果',
                'userScores': '用户体验',
                'techScores': '技术质量'
            };
            return map[dimension] || dimension;
        },

        // 获取维度颜色
        getDimensionColor(dimension) {
            const map = {
                'clinicalScores': '#67C23A',
                'userScores': '#409EFF',
                'techScores': '#E6A23C'
            };
            return map[dimension] || '#909399';
        },

        // 计算维度平均分
        calcDimensionAvg(scores) {
            if (!scores) return 0;
            const values = Object.values(scores);
            if (values.length === 0) return 0;
            return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
        },

        // 查看疾病详情
        viewDiseaseDetail(disease) {
            this.currentDisease = disease;
            this.showDiseaseDialog = true;
        },

        // 查看教程详情
        viewTutorialDetail(tutorial) {
            this.currentTutorial = tutorial;
            this.showTutorialDialog = true;
        },

        // 智能选机 - 上一步
        prevSelectorStep() {
            if (this.selectorStep > 0) {
                this.selectorStep--;
            }
        },

        // 智能选机 - 下一步
        nextSelectorStep() {
            // 验证当前步骤
            if (this.selectorStep === 0 && !this.selectorAnswers.purpose) {
                this.$message.warning('请选择使用目的');
                return;
            }
            if (this.selectorStep === 2) {
                if (this.selectorAnswers.scenarios.length === 0) {
                    this.$message.warning('请至少选择一个使用场景');
                    return;
                }
                if (!this.selectorAnswers.noiseSensitivity) {
                    this.$message.warning('请选择噪音敏感度');
                    return;
                }
            }
            if (this.selectorStep === 3 && !this.selectorAnswers.budget) {
                this.$message.warning('请选择预算范围');
                return;
            }

            if (this.selectorStep < 4) {
                this.selectorStep++;
            }

            // 最后一步生成推荐
            if (this.selectorStep === 4) {
                this.generateRecommendation();
            }
        },

        // 重新选择
        restartSelector() {
            this.selectorStep = 0;
            this.selectorAnswers = {
                purpose: '',
                ahiLevel: '',
                hasCentral: null,
                copdLevel: '',
                hasCO2Retention: null,
                severityLevel: '',
                scenarios: [],
                noiseSensitivity: '',
                features: [],
                budget: ''
            };
            this.recommendedProducts = [];
        },

        // 生成推荐
        generateRecommendation() {
            const answers = this.selectorAnswers;
            let candidates = [...this.products];

            // 根据使用目的筛选
            if (answers.purpose === 'sleep_apnea') {
                candidates = candidates.filter(p =>
                    p.suitableFor && p.suitableFor.includes('sleep_apnea')
                );
            } else if (answers.purpose === 'copd') {
                candidates = candidates.filter(p =>
                    p.suitableFor && p.suitableFor.includes('copd')
                );
            } else if (answers.purpose === 'heart_failure') {
                candidates = candidates.filter(p =>
                    p.suitableFor && (p.suitableFor.includes('heart_failure') || p.suitableFor.includes('copd'))
                );
            } else if (answers.purpose === 'neuromuscular') {
                candidates = candidates.filter(p =>
                    p.suitableFor && p.suitableFor.includes('neuromuscular')
                );
            }

            // 根据预算筛选
            const budgetRanges = {
                'low': [0, 3000],
                'medium': [3000, 6000],
                'high': [6000, 10000],
                'premium': [10000, 999999]
            };
            const [minBudget, maxBudget] = budgetRanges[answers.budget] || [0, 999999];
            candidates = candidates.filter(p => p.price >= minBudget && p.price <= maxBudget);

            // 如果没有符合条件的产品，放宽预算范围
            if (candidates.length === 0) {
                candidates = this.products.filter(p =>
                    (!answers.purpose || !p.suitableFor || p.suitableFor.includes(answers.purpose))
                );
            }

            // 计算匹配分数
            candidates = candidates.map(product => {
                let matchScore = 70; // 基础分
                let matchReasons = [];

                // 价格匹配度
                if (product.price >= minBudget && product.price <= maxBudget) {
                    matchScore += 10;
                    matchReasons.push('价格符合预算');
                }

                // 使用场景匹配
                if (answers.scenarios.includes('travel') && product.type.includes('便携')) {
                    matchScore += 10;
                    matchReasons.push('适合旅行携带');
                }

                // 噪音敏感度匹配
                if (answers.noiseSensitivity === 'high') {
                    const noiseLevel = product.specs['噪音水平'];
                    if (noiseLevel && parseFloat(noiseLevel) < 28) {
                        matchScore += 10;
                        matchReasons.push('超静音设计');
                    }
                }

                // 功能需求匹配
                if (answers.features.includes('auto_adjust') &&
                    (product.type.includes('全自动') || product.type.includes('自动'))) {
                    matchScore += 5;
                    matchReasons.push('支持自动调压');
                }
                if (answers.features.includes('humidifier') && product.highlights.some(h => h.includes('加湿'))) {
                    matchScore += 5;
                    matchReasons.push('内置加温加湿');
                }
                if (answers.features.includes('data_tracking') && product.highlights.some(h => h.includes('APP') || h.includes('数据'))) {
                    matchScore += 5;
                    matchReasons.push('支持APP数据追踪');
                }
                if (answers.features.includes('portable') && product.highlights.some(h => h.includes('便携') || h.includes('轻便'))) {
                    matchScore += 5;
                    matchReasons.push('便携轻便');
                }

                // 评分加成
                if (product.rating >= 4.7) {
                    matchScore += 5;
                    matchReasons.push('用户评分高');
                }

                // 热门加成
                if (product.tag) {
                    matchReasons.push(product.tag === '热销' ? '热销产品' : product.tag + '产品');
                }

                // 确保有推荐理由
                if (matchReasons.length === 0) {
                    matchReasons.push('符合基本需求');
                }

                return {
                    ...product,
                    matchScore: Math.min(matchScore, 98),
                    matchReasons: matchReasons.slice(0, 4)
                };
            });

            // 按匹配分数排序
            candidates.sort((a, b) => b.matchScore - a.matchScore);

            // 取前3个
            this.recommendedProducts = candidates.slice(0, 3);

            // 如果推荐结果不足3个，从全部产品中补充
            if (this.recommendedProducts.length < 3) {
                const existingIds = this.recommendedProducts.map(p => p.id);
                const additional = this.products
                    .filter(p => !existingIds.includes(p.id))
                    .slice(0, 3 - this.recommendedProducts.length)
                    .map(p => ({
                        ...p,
                        matchScore: 60,
                        matchReasons: ['备选推荐']
                    }));
                this.recommendedProducts = [...this.recommendedProducts, ...additional];
            }
        },

        // 获取匹配度颜色
        getMatchColor(score) {
            if (score >= 90) return '#67C23A';
            if (score >= 80) return '#409EFF';
            if (score >= 70) return '#E6A23C';
            return '#909399';
        }
    }
});
