/**
 * KKABONI Platform - Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE SYSTEM ---
  let state = {
    isLoggedIn: false,
    activeTab: 'tab-a',
    vsBasket: [], // Maximum 3 vendors
    searchResults: [],
    reviews: [
      {
        id: 1,
        vendor_name: "루미너스 포토그라피 (청담)",
        stars: 5,
        clean_score: 95,
        content: "결제금액 3300000원 결제했고 헬퍼 이모님 추가금 포함해서 계약했습니다. 촬영날 액자갈이 30만원 추가금이 나갔는데, 스튜디오 결과물 자체는 퀄리티가 만족스럽네요. 단점은 주차가 조금 힘들었다는 점입니다.",
        proof_image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop"
      },
      {
        id: 2,
        vendor_name: "메종 드 시그니처 (경기북부)",
        stars: 2,
        clean_score: 82,
        content: "처음 가성비가 맘에 들어서 180만원에 스드메 계약했는데 드레스 셀렉할 때 추가 피팅비에 원본 파일 44만원 강매까지 추가금이 너무 비쌉니다. 이모님 출장비도 20만원 받으시는데 계약 조약이 매우 빡빡하네요.",
        proof_image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=500&auto=format&fit=crop"
      }
    ],
    chosenVendor: null,
    planNotes: ""
  };

  // --- LOCALSTORAGE CACHE LOAD ---
  const loadStateFromStorage = () => {
    const savedLoggedIn = localStorage.getItem('kkaboni_logged_in');
    const savedChosen = localStorage.getItem('kkaboni_chosen_vendor');
    const savedNotes = localStorage.getItem('kkaboni_plan_notes');
    const savedReviews = localStorage.getItem('kkaboni_reviews');
    
    if (savedLoggedIn === 'true') {
      state.isLoggedIn = true;
    }
    if (savedChosen) {
      state.chosenVendor = JSON.parse(savedChosen);
    }
    if (savedNotes) {
      state.planNotes = savedNotes;
    }
    if (savedReviews) {
      state.reviews = JSON.parse(savedReviews);
    }
  };

  loadStateFromStorage();

  // --- UI SELECTORS ---
  const toast = document.getElementById('toast');
  const logoBtn = document.getElementById('logo-btn');
  const globalAuthBtn = document.getElementById('global-auth-btn');
  const headerVsBtn = document.getElementById('header-vs-btn');
  const mainNav = document.getElementById('main-nav');
  const landingSection = document.getElementById('landing-section');
  const landingStartBtn = document.getElementById('landing-start-btn');
  const authView = document.getElementById('auth-view');
  const authForm = document.getElementById('auth-form');
  const appMain = document.getElementById('app-main');
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const vsCountBadge = document.getElementById('vs-count-badge');

  // Tab A elements
  const searchForm = document.getElementById('search-form');
  const loadingOverlay = document.getElementById('loading-overlay');
  const loadingText = document.getElementById('loading-text');
  const resultsContainer = document.getElementById('results-container');
  const resultsList = document.getElementById('results-list');
  const sortBtns = document.querySelectorAll('.btn-sort');

  // Tab B elements
  const comparisonEmpty = document.getElementById('comparison-empty');
  const comparisonFilled = document.getElementById('comparison-filled');
  const activeSlotsContainer = document.getElementById('active-slots-container');

  // Tab C elements
  const reviewForm = document.getElementById('review-form');
  const charCounter = document.getElementById('char-count');
  const reviewContentInput = document.getElementById('review-content');
  const aiReviewFeedback = document.getElementById('ai-review-feedback');
  const reviewSearchInput = document.getElementById('review-search');
  const reviewsContainer = document.getElementById('reviews-container');
  const reviewDetailView = document.getElementById('review-detail-view');
  const communityMainView = document.getElementById('community-main-view');
  const reviewBackBtn = document.getElementById('review-back-btn');
  const detailVendorName = document.getElementById('detail-vendor-name');
  const detailStars = document.getElementById('detail-stars');
  const detailCleanScore = document.getElementById('detail-clean-score');
  const detailTextBody = document.getElementById('detail-text-body');
  const detailProofImage = document.getElementById('detail-proof-image');

  // Tab D elements
  const chosenEmpty = document.getElementById('chosen-empty');
  const chosenFilled = document.getElementById('chosen-filled');
  const planNotesTextarea = document.getElementById('plan-notes');
  const savePlanBtn = document.getElementById('save-plan-btn');
  const goToABtn = document.getElementById('go-to-a-btn');

  // Modal elements
  const vendorModal = document.getElementById('vendor-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalHeroImage = document.getElementById('modal-hero-image');
  const modalTransparencyBadge = document.getElementById('modal-transparency-badge');
  const modalReviewRating = document.getElementById('modal-review-rating');
  const modalBtnVs = document.getElementById('modal-btn-vs');
  const modalBtnChoice = document.getElementById('modal-btn-choice');
  const modalChecklist = document.getElementById('modal-checklist');
  const modalBasePrice = document.getElementById('modal-base-price');
  const modalReceiptItems = document.getElementById('modal-receipt-items');
  const modalFinalTotal = document.getElementById('modal-final-total');
  const modalHiddenCostsProgress = document.getElementById('modal-hidden-costs-progress');
  const modalInflationReason = document.getElementById('modal-inflation-reason');
  const modalReviewTags = document.getElementById('modal-review-tags');
  const modalAiComment = document.getElementById('modal-ai-comment');
  const modalWarningBox = document.getElementById('modal-warning-box');
  const modalWarningReason = document.getElementById('modal-warning-reason');

  let currentGalleryIndex = 0;
  let currentGalleryImages = [];

  // --- GENERAL FUNCTIONS ---
  const showToast = (message, isCenter = false) => {
    toast.innerText = message;
    if (isCenter) {
      toast.classList.add('center-toast');
    } else {
      toast.classList.remove('center-toast');
    }
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('center-toast');
    }, isCenter ? 3500 : 2500);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('ko-KR').format(num) + '원';
  };

  // --- VIEW SYNC ---
  const syncAuthUI = () => {
    if (state.isLoggedIn) {
      document.body.classList.remove('not-logged-in');
      globalAuthBtn.innerText = '로그아웃';
      mainNav.classList.remove('hidden');
      landingSection.classList.add('hidden');
      landingSection.style.display = 'none';
      authView.classList.add('hidden');
      if (headerVsBtn) {
        headerVsBtn.classList.add('hidden');
        headerVsBtn.style.display = 'none';
      }
      appMain.classList.remove('hidden');
      appMain.style.display = 'block';
      switchTab(state.activeTab);
    } else {
      document.body.classList.add('not-logged-in');
      globalAuthBtn.innerText = '로그인 / 회원가입';
      mainNav.classList.add('hidden');
      landingSection.classList.remove('hidden');
      landingSection.style.display = 'flex';
      authView.classList.add('hidden');
      if (headerVsBtn) {
        headerVsBtn.classList.remove('hidden');
        headerVsBtn.style.display = 'inline-block';
      }
      appMain.classList.add('hidden');
      appMain.style.display = 'none';
    }
    updateVSCountBadge();
  };

  const switchTab = (tabId) => {
    state.activeTab = tabId;
    navBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.id === `${tabId}-section`) {
        content.classList.add('active');
        content.style.display = 'block';
      } else {
        content.classList.remove('active');
        content.style.display = 'none';
      }
    });

    landingSection.style.display = 'none';
    appMain.style.display = 'block';

    // Specific Tab Init Logic
    if (tabId === 'tab-a') {
      if (state.searchResults.length === 0) {
        // Trigger initial dummy data fetch automatically without throwing errors
        doSearch('seoul').catch(() => {});
      }
    } else if (tabId === 'tab-b') {
      renderTabB();
    } else if (tabId === 'tab-c') {
      renderTabCList();
    } else if (tabId === 'tab-d') {
      renderTabD();
    }
  };

  const updateVSCountBadge = () => {
    const len = state.vsBasket.length;
    if (len > 0) {
      vsCountBadge.innerText = len;
      vsCountBadge.classList.remove('hidden');
    } else {
      vsCountBadge.classList.add('hidden');
    }
  };

  // --- AUTH HANDLERS ---
  globalAuthBtn.addEventListener('click', () => {
    if (state.isLoggedIn) {
      // Logout
      state.isLoggedIn = false;
      state.vsBasket = [];
      localStorage.removeItem('kkaboni_logged_in');
      syncAuthUI();
      showToast('로그아웃 되었습니다.');
    } else {
      // Toggle Login form
      landingSection.classList.add('hidden');
      authView.classList.remove('hidden');
    }
  });

  landingStartBtn.addEventListener('click', () => {
    authView.classList.remove('hidden');
    authView.style.display = 'block';
    authView.style.opacity = '1';
    authView.scrollIntoView({ behavior: 'smooth' });
  });

  if (headerVsBtn) {
    headerVsBtn.addEventListener('click', () => {
      authView.classList.remove('hidden');
      authView.style.display = 'block';
      authView.style.opacity = '1';
      authView.scrollIntoView({ behavior: 'smooth' });
    });
  }

  logoBtn.addEventListener('click', () => {
    // 모든 탭 숨기기
    tabContents.forEach(content => {
      content.classList.remove('active');
      content.style.display = 'none';
    });
    navBtns.forEach(btn => btn.classList.remove('active'));

    // 메인 소개 화면 보이기
    landingSection.style.opacity = '1';
    landingSection.classList.remove('hidden');
    landingSection.style.display = 'flex';
    authView.classList.add('hidden');
    authView.style.display = 'none';
    appMain.classList.add('hidden');
    appMain.style.display = 'none';
  });

  const testAccountBtn = document.getElementById('test-account-btn');
  if (testAccountBtn) {
    testAccountBtn.addEventListener('click', () => {
      document.getElementById('email').value = 'test@kkaboni.com';
      document.getElementById('password').value = '1234';
      
      const submitEvent = new Event('submit', { cancelable: true });
      authForm.dispatchEvent(submitEvent);
    });
  }

  const signupModal = document.getElementById('signup-modal');
  const openSignupBtn = document.getElementById('open-signup-btn');
  const closeSignupBtn = document.getElementById('close-signup-btn');
  const signupForm = document.getElementById('signup-form');

  if (openSignupBtn) {
    openSignupBtn.addEventListener('click', () => {
      signupModal.classList.remove('hidden');
    });
  }
  if (closeSignupBtn) {
    closeSignupBtn.addEventListener('click', () => {
      signupModal.classList.add('hidden');
    });
  }
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const pw = document.getElementById('signup-password').value;
      
      localStorage.setItem('kkaboni_user_info', JSON.stringify({ name, email, pw }));
      showToast(`${name}님, 회원가입이 완료되었습니다! 로그인해주세요.`);
      signupModal.classList.add('hidden');
      signupForm.reset();
    });
  }

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    let isSuccess = false;
    let userName = '테스트 계정';

    if (email === 'test@kkaboni.com' && password === '1234') {
      isSuccess = true;
    } else {
      const savedInfo = localStorage.getItem('kkaboni_user_info');
      if (savedInfo) {
        const userInfo = JSON.parse(savedInfo);
        if (userInfo.email === email && userInfo.pw === password) {
          isSuccess = true;
          userName = userInfo.name;
        }
      }
    }

    if (isSuccess) {
      state.isLoggedIn = true;
      localStorage.setItem('kkaboni_logged_in', 'true');
      
      authView.style.opacity = '0';
      authView.style.transition = 'opacity 0.3s ease';
      
      setTimeout(() => {
        syncAuthUI();
        appMain.style.opacity = '0';
        
        setTimeout(() => {
          appMain.style.transition = 'opacity 0.5s ease';
          appMain.style.opacity = '1';
          showToast(`${userName}님 로그인 성공!`);
        }, 50);
      }, 300);
    } else {
      showToast('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  });

  // Tab change click
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetTab = btn.getAttribute('data-tab');
      if (!state.isLoggedIn && targetTab !== 'tab-a') {
        e.preventDefault();
        showToast('🔒 로그인이 필요한 서비스입니다.\n호갱 탈출을 위해 로그인해 주세요!', true);
        logoBtn.click();
        setTimeout(() => { landingStartBtn.click(); }, 300);
        return;
      }
      switchTab(targetTab);
    });
  });

  // --- TAB A: 견적 까보자! LOGIC ---
  const doSearch = async (region) => {
    if (!region) return;
    const itemType = document.getElementById('item')?.value || null;
    const budgetRaw = document.getElementById('budget').value;
    const budgetLimit = budgetRaw ? Number(budgetRaw) * 10000 : null;

    resultsContainer.classList.add('hidden');
    resultsList.innerHTML = '';
    loadingOverlay.classList.remove('hidden');
    loadingText.innerText = "Agent 2: 지역 및 품목 데이터를 분석 중...";

    try {
      const raw = await window.Agent2.fetchData(region, itemType, null); // budget limit은 Agent3 완료 후 적용
      
      loadingText.innerText = "Agent 3: 추가 비용 요약 및 AI 신뢰성 연산 중...";
      let analyzed = await window.Agent3.analyzeQuotes(raw);
      
      if (budgetLimit && !isNaN(budgetLimit)) {
        analyzed = analyzed.filter(v => v.total_price <= budgetLimit);
      }

      state.searchResults = analyzed;

      // Initial Sort
      const activeSortBtn = document.querySelector('.btn-sort.active');
      const criteria = activeSortBtn ? activeSortBtn.getAttribute('data-sort') : 'name';

      setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        if (state.searchResults.length === 0) {
          resultsList.innerHTML = '<div class="empty-state" style="text-align:center; padding: 40px; color: var(--text-secondary);">조건에 맞는 업체가 없습니다.</div>';
          resultsContainer.classList.remove('hidden');
        } else {
          sortResults(criteria);
          resultsContainer.classList.remove('hidden');
        }
      }, 1500);

    } catch (err) {
      loadingOverlay.classList.add('hidden');
      alert(err.message || "오류가 발생했습니다.");
    }
  };

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const region = document.getElementById('region').value;
    doSearch(region);
  });

  document.getElementById('region').addEventListener('change', (e) => {
    doSearch(e.target.value);
  });

  const sortResults = (criteria) => {
    if (criteria === 'name') {
      state.searchResults.sort((a, b) => a.vendor_name.localeCompare(b.vendor_name, 'ko'));
    } else if (criteria === 'score') {
      state.searchResults.sort((a, b) => b.safety_score - a.safety_score);
    } else if (criteria === 'price') {
      state.searchResults.sort((a, b) => a.total_price - b.total_price);
    }

    renderSearchResults();
  };

  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sortResults(btn.getAttribute('data-sort'));
    });
  });

  const renderSearchResults = () => {
    resultsList.innerHTML = '';
    state.searchResults.forEach(vendor => {
      const isSelected = state.vsBasket.some(v => v.vendor_id === vendor.vendor_id);
      
      const itemCard = document.createElement('div');
      itemCard.className = 'result-item-card';
      
      itemCard.innerHTML = `
        <div class="item-left">
          <img class="item-thumbnail" src="${vendor.images[0]}" alt="${vendor.vendor_name}">
          <div class="item-info">
            <h4 class="vendor-link">${vendor.vendor_name}</h4>
            <div class="item-meta">
              <span class="transparency-badge ${vendor.transparency_class}">${vendor.transparency_label} (${vendor.safety_score}점)</span>
              <span>리뷰 ${vendor.reviews_count}개 기반</span>
            </div>
          </div>
        </div>
        <div class="item-right" style="display: flex; align-items: center; gap: 20px;">
          <div class="item-price-wrap">
            <div class="price-base" style="font-size: 12px; color: var(--text-secondary);">기본 패키지 ${formatCurrency(vendor.base_price)}</div>
            <div style="font-size: 10px; color: var(--text-secondary); text-align: right; margin: -2px 0;">↓</div>
            <div class="price-final" style="font-weight: 800; font-size: 16px; color: var(--accent-blue);">실제 예상 총액 ${formatCurrency(vendor.total_price)}</div>
          </div>
          <button class="btn-vs-add ${isSelected ? 'active' : ''}" data-id="${vendor.vendor_id}">
            ${isSelected ? '담김' : '[ VS ]'}
          </button>
        </div>
      `;

      // Event: Info open Modal
      itemCard.querySelector('.vendor-link').addEventListener('click', () => openVendorModal(vendor));
      itemCard.querySelector('.item-thumbnail').addEventListener('click', () => openVendorModal(vendor));

      // Event: VS Basket Add
      const vsBtn = itemCard.querySelector('.btn-vs-add');
      vsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleVSBasket(vendor, vsBtn);
      });

      resultsList.appendChild(itemCard);
    });
  };

  const toggleVSBasket = (vendor, btnElement) => {
    const idx = state.vsBasket.findIndex(v => v.vendor_id === vendor.vendor_id);
    if (idx > -1) {
      state.vsBasket.splice(idx, 1);
      btnElement.classList.remove('active');
      btnElement.innerText = '[ VS ]';
      showToast(`${vendor.vendor_name} 제거됨`);
    } else {
      if (state.vsBasket.length >= 3) {
        alert("최대 3개까지만 비교 가능합니다");
        return;
      }
      state.vsBasket.push(vendor);
      btnElement.classList.add('active');
      btnElement.innerText = '담김 VS';
      showToast(`${vendor.vendor_name} VS 담기 완료`);
    }
    updateVSCountBadge();
  };

  // --- DETAILS POPUP MODAL LOGIC ---
  const openVendorModal = (vendor) => {
    modalHeroImage.src = vendor.images[0] || 'https://images.unsplash.com/photo-1519225495810-7512c696505a?w=600&auto=format&fit=crop&q=60';
    modalTitle.innerText = vendor.vendor_name;
    
    // Transparency Badge
    modalTransparencyBadge.className = `transparency-badge ${vendor.transparency_class}`;
    modalTransparencyBadge.innerText = `${vendor.transparency_label} (${vendor.safety_score}점)`;
    
    modalReviewRating.innerText = `★ ${((vendor.safety_score / 2) + 0.5).toFixed(1)} / 5.0`;
    modalReceiptTotal.innerText = formatCurrency(vendor.total_price);
    
    // VS Add Button state
    const isSelected = state.vsBasket.some(v => v.vendor_id === vendor.vendor_id);
    modalBtnVs.innerText = isSelected ? '비교함 비우기' : '비교함에 담기';
    modalBtnVs.onclick = () => {
      const btn = document.querySelector(`.btn-vs-add[data-id="${vendor.vendor_id}"]`);
      toggleVSBasket(vendor, btn || document.createElement('button'));
      modalBtnVs.innerText = state.vsBasket.some(v => v.vendor_id === vendor.vendor_id) ? '비교함 비우기' : '비교함에 담기';
    };
    
    modalBtnChoice.onclick = () => {
      selectFinalVendor(vendor);
      vendorModal.classList.add('hidden');
    };
    
    // Checklist
    modalChecklist.innerHTML = '';
    const hasS = vendor.ai_analysis.features.some(f => f.includes('스튜디오') || f.includes('컨셉'));
    const hasD = vendor.ai_analysis.features.some(f => f.includes('드레스') || f.includes('실크'));
    const hasM = vendor.ai_analysis.features.some(f => f.includes('메이크업') || f.includes('디렉팅') || f.includes('상담'));
    
    modalChecklist.innerHTML += `
      <div class="checklist-item ${hasS ? 'included' : 'excluded'}">${hasS ? '✓' : '✗'} 스튜디오 촬영 포함</div>
      <div class="checklist-item ${hasD ? 'included' : 'excluded'}">${hasD ? '✓' : '✗'} 헬퍼 이모님 피팅 포함</div>
      <div class="checklist-item ${hasM ? 'included' : 'excluded'}">${hasM ? '✓' : '✗'} 헤어 & 메이크업 포함</div>
      <div class="checklist-item excluded">✗ 턱시도/대여복 미포함</div>
    `;
    
    // Breakdown
    modalBasePrice.innerText = formatCurrency(vendor.base_price);
    modalReceiptItems.innerHTML = '';
    vendor.hidden_costs.forEach(cost => {
      const row = document.createElement('div');
      row.className = 'breakdown-row';
      const mark = cost.is_mandatory ? '(필수)' : '(선택)';
      row.innerHTML = `<span>+ ${cost.item_name} ${mark}</span><span>${formatCurrency(cost.average_cost)}</span>`;
      modalReceiptItems.appendChild(row);
    });
    modalFinalTotal.innerText = formatCurrency(vendor.total_price);
    
    // Hidden Cost Progress
    modalHiddenCostsProgress.innerHTML = '';
    vendor.hidden_costs.forEach(cost => {
      const container = document.createElement('div');
      container.className = 'progress-container';
      const occurrence = cost.occurrence || Math.floor(Math.random() * 50) + 50;
      container.innerHTML = `
        <div class="progress-label-wrap">
          <span>${cost.item_name}</span>
          <span>발생률 ${occurrence}% (${formatCurrency(cost.average_cost)})</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${occurrence}%"></div>
        </div>
      `;
      modalHiddenCostsProgress.appendChild(container);
    });
    
    // AI Insight & [추가금 발생 사유] Alert Box
    const hiddenTotal = vendor.hidden_costs.reduce((acc, c) => acc + c.average_cost, 0);
    if (hiddenTotal > 0) {
      const topCost = vendor.hidden_costs.reduce((prev, current) => (prev.average_cost > current.average_cost) ? prev : current);
      const reasonText = `이 업체는 기본 견적가 대비 총 ${formatCurrency(hiddenTotal)}의 추가 비용이 발생합니다. 주요 원인은 [${topCost.item_name}]의 필수 추가 옵션 유도 및 배송/진행 추가 경비입니다.`;
      
      modalInflationReason.innerText = `[가격 경고] ${reasonText}`;
      if (modalWarningBox && modalWarningReason) {
        modalWarningReason.innerText = reasonText;
        modalWarningBox.style.display = 'block';
      }
    } else {
      modalInflationReason.innerText = "이 업체는 숨겨진 추가금이 전혀 없거나 매우 낮은 수준의 아주 투명하고 정직한 견적의 업체입니다.";
      if (modalWarningBox && modalWarningReason) {
        modalWarningReason.innerText = "이 업체는 약관 위반 및 숨겨진 과도한 비용이 발견되지 않은 안심 투명 업체입니다.";
        modalWarningBox.style.display = 'block';
        modalWarningBox.style.background = '#ECFDF5';
        modalWarningBox.style.borderColor = '#10B981';
        modalWarningBox.querySelector('h5').style.color = '#065F46';
        modalWarningBox.querySelector('h5').innerText = '✨ 안심 정찰제 업체 (추가금 발생 낮음)';
        modalWarningReason.style.color = '#047857';
      }
    }
    
    // Review Tags
    modalReviewTags.innerHTML = '';
    const tags = ["#정찰제", "#인증완료", `#추가금_${Math.round(hiddenTotal/10000)}만원`, "#지출검증"];
    if (hiddenTotal > 1000000) tags.push("#추가금주의");
    else tags.push("#가성비좋음");
    
    tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'review-tag';
      span.innerText = t;
      modalReviewTags.appendChild(span);
    });
    
    // AI Comment
    modalAiComment.innerText = vendor.ai_analysis.notes.join("\n") + "\n\n실제 예비 부부들의 영수증 인증에 기반하여 분석된 가격 인사이트 정보입니다.";
    
    vendorModal.classList.remove('hidden');
  };

  modalCloseBtn.addEventListener('click', () => {
    vendorModal.classList.add('hidden');
  });

  window.addEventListener('click', (e) => {
    if (e.target === vendorModal) {
      vendorModal.classList.add('hidden');
    }
  });

  // --- SVG RADAR CHART GENERATOR (Used in TAB B) ---
  const generateRadarSVG = (datasets, strokeColors, fillColors, customWidth = 240) => {
    const width = customWidth;
    const height = customWidth;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = (width / 2) - 40;
    const numAxes = 5;
    const labels = ["투명성", "만족도", "퀄리티", "안정성", "시설"];

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    // Draw background concentric pentagons
    const levels = [0.25, 0.5, 0.75, 1.0];
    levels.forEach(lvl => {
      const points = [];
      for (let i = 0; i < numAxes; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI / numAxes);
        const r = lvl * maxRadius;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      poly.setAttribute("points", points.join(" "));
      poly.setAttribute("stroke", "rgba(255, 255, 255, 0.1)");
      poly.setAttribute("fill", "transparent");
      svg.appendChild(poly);
    });

    // Draw axes straight lines & Labels
    for (let i = 0; i < numAxes; i++) {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI / numAxes);
      const xLine = centerX + maxRadius * Math.cos(angle);
      const yLine = centerY + maxRadius * Math.sin(angle);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", centerX);
      line.setAttribute("y1", centerY);
      line.setAttribute("x2", xLine);
      line.setAttribute("y2", yLine);
      line.setAttribute("stroke", "rgba(255, 255, 255, 0.15)");
      svg.appendChild(line);

      // Label positioning
      const textDist = maxRadius + 18;
      const xText = centerX + textDist * Math.cos(angle);
      const yText = centerY + textDist * Math.sin(angle);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", xText);
      text.setAttribute("y", yText);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("fill", "#9CA3AF");
      text.setAttribute("font-size", "11px");
      text.setAttribute("font-weight", "bold");
      text.textContent = labels[i];
      svg.appendChild(text);
    }

    // Draw datasets polygons
    datasets.forEach((stat, dsIdx) => {
      const values = [
        stat.transparency,
        stat.satisfaction,
        stat.quality,
        stat.stability,
        stat.facility
      ];

      const points = [];
      values.forEach((v, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI / numAxes);
        const score = Math.max(0, Math.min(20, v));
        const r = (score / 20) * maxRadius;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        points.push(`${x},${y}`);
      });

      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      poly.setAttribute("points", points.join(" "));
      poly.setAttribute("stroke", strokeColors[dsIdx]);
      poly.setAttribute("stroke-width", "2.5");
      poly.setAttribute("fill", fillColors[dsIdx]);
      svg.appendChild(poly);

      // 숫자 표기 (100점 만점 환산 점수)
      values.forEach((v, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI / numAxes);
        const score = Math.max(0, Math.min(20, v));
        const r = (score / 20) * maxRadius;
        
        // 텍스트를 약간 바깥쪽에 렌더링
        const textR = r + 12 + (dsIdx * 10); // 여러 데이터셋 겹침 방지
        const xText = centerX + textR * Math.cos(angle);
        const yText = centerY + textR * Math.sin(angle);

        const pointScore100 = Math.round(score * 5);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", xText);
        text.setAttribute("y", yText);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("fill", strokeColors[dsIdx]);
        text.setAttribute("font-size", "11px");
        text.setAttribute("font-weight", "900");
        text.setAttribute("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.8))");
        text.textContent = pointScore100;
        svg.appendChild(text);
      });
    });

    return svg;
  };

  // --- TAB B: 맞짱 까보자! LOGIC ---
  const renderTabB = () => {
    const comparisonEmpty = document.getElementById('comparison-empty');
    const aiAdviceWrap = document.getElementById('ai-advice-wrap');
    
    if (state.vsBasket.length === 0) {
      comparisonEmpty.classList.remove('hidden');
      comparisonEmpty.style.display = 'block';
      comparisonFilled.classList.add('hidden');
      comparisonFilled.style.display = 'none';
      if (aiAdviceWrap) {
        aiAdviceWrap.classList.add('hidden');
        aiAdviceWrap.style.display = 'none';
      }
      return;
    }
    
    comparisonEmpty.classList.add('hidden');
    comparisonEmpty.style.display = 'none';
    comparisonFilled.classList.remove('hidden');
    comparisonFilled.style.display = 'block';
    
    // FIFA / Pokemon Style Card Render Logic
    activeSlotsContainer.innerHTML = '';
    
    state.vsBasket.forEach((v, i) => {
      const slotDiv = document.createElement('div');
      slotDiv.className = `yugioh-card filled ${v.transparency_class}`;
      slotDiv.style.backgroundImage = `url('${v.images[0]}')`;
      
      slotDiv.innerHTML = `
        <div class="yugioh-card-inner" style="height: 100%; display: flex; flex-direction: column;">
          <div class="yugioh-card-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <h3 class="yugioh-vendor-name" style="color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.8); margin: 0; font-size: 18px; font-weight:800;">${v.vendor_name}</h3>
            <span class="yugioh-transparency badge-${v.transparency_class}">${v.transparency_label}</span>
          </div>
          
          <!-- Pentagon Radar Chart Container -->
          <div class="radar-chart-wrap" style="display:flex; justify-content:center; align-items:center; margin: 10px 0; height: 130px; position: relative;">
          </div>
          
          <div class="yugioh-card-body" style="margin-top: auto; color: white;">
            <div class="yugioh-stat-row" style="margin-bottom: 4px; font-size:12px;">
              <span class="yugioh-stat-label" style="color: #DDD;">기본 패키지</span>
              <span class="yugioh-stat-value" style="font-weight:700;">${formatCurrency(v.base_price)}</span>
            </div>
            <div class="yugioh-stat-row" style="margin-bottom: 4px; font-size:12px;">
              <span class="yugioh-stat-label" style="color: #DDD;">예상 추가금</span>
              <span class="yugioh-stat-value" style="color:#FFA500; font-weight:700;">+${formatCurrency(v.total_hidden_cost)}</span>
            </div>
            <hr class="yugioh-divider" style="margin: 8px 0; border: 0; border-top: 1px solid rgba(255,255,255,0.2);" />
            <div class="yugioh-stat-row total-row" style="margin-bottom: 8px;">
              <span class="yugioh-stat-label" style="color: #FFF; font-weight: 800;">실제 예상 총액</span>
              <span class="yugioh-stat-value" style="color:#FBBF24; font-size: 18px; font-weight: 900;">${formatCurrency(v.total_price)}</span>
            </div>
            
            <!-- Details Box (장점, 단점, 특이사항) -->
            <div class="card-details-box" style="font-size: 11px; background: rgba(0,0,0,0.65); padding: 8px; border-radius: 8px; line-height: 1.4; text-align: left; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.1);">
              <div>🟢 <strong>장점:</strong> ${v.ai_analysis.pros[0] || '우수한 피드백'}</div>
              <div>🔴 <strong>단점:</strong> ${v.ai_analysis.cons[0] || '성수기 예약 난이도'}</div>
              <div>💡 <strong>특이사항:</strong> ${v.ai_analysis.notes[0] || '추가 지출 안전성 높음'}</div>
            </div>
          </div>
          <button class="btn-secondary remove-slot-btn" style="width: 100%; padding: 8px; border-radius: 10px; font-weight:700; font-size:12px; border: none; background: rgba(255,255,255,0.2); color: white; cursor: pointer;" data-idx="${i}">슬롯 비우기</button>
        </div>
      `;
      
      // Generate and inject radar chart
      const radarWrap = slotDiv.querySelector('.radar-chart-wrap');
      const radarSvg = generateRadarChart(120, 120, [v.stats], ['#FFF'], ['rgba(255, 255, 255, 0.25)']);
      
      // Inject score text inside the center of SVG
      const centerX = 60;
      const centerY = 60;
      const centerText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      centerText.setAttribute("x", centerX);
      centerText.setAttribute("y", centerY);
      centerText.setAttribute("text-anchor", "middle");
      centerText.setAttribute("dominant-baseline", "middle");
      centerText.setAttribute("fill", "#FFFFFF");
      centerText.setAttribute("font-size", "14px");
      centerText.setAttribute("font-weight", "900");
      centerText.textContent = Math.round(v.safety_score * 10);
      radarSvg.appendChild(centerText);

      radarWrap.appendChild(radarSvg);

      // Card Selection Click Handler
      slotDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-slot-btn')) return;
        handleCardClick(slotDiv, v);
      });
      
      slotDiv.querySelector('.remove-slot-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const searchBtn = document.querySelector(`.btn-vs-add[data-id="${v.vendor_id}"]`);
        if (searchBtn) {
          searchBtn.classList.remove('active');
          searchBtn.innerText = '[ VS ]';
        }
        state.vsBasket.splice(i, 1);
        updateVSCountBadge();
        renderTabB();
      });
      activeSlotsContainer.appendChild(slotDiv);
    });
    
    // Fill remaining empty slots up to 3
    const emptyCount = 3 - state.vsBasket.length;
    for (let i = 0; i < emptyCount; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'yugioh-card empty-card';
      emptyDiv.innerHTML = `
        <div class="yugioh-card-inner empty-inner">
          <div style="font-size:40px; color:var(--text-secondary); margin-bottom:15px;">+</div>
          <div style="font-size:16px; color:var(--text-secondary); font-weight:700;">비어있는 슬롯</div>
          <p style="font-size:12px; color:var(--text-secondary); text-align:center; margin-top:10px;">'견적 까보자!' 탭에서 업체를 담아주세요.</p>
        </div>
      `;
      activeSlotsContainer.appendChild(emptyDiv);
    }

    // AI Advice Panel Trigger (Only when all 3 slots are filled)
    if (state.vsBasket.length === 3) {
      if (aiAdviceWrap) {
        aiAdviceWrap.classList.remove('hidden');
        aiAdviceWrap.style.display = 'block';
        renderAIAdvice(aiAdviceWrap);
      }
    } else {
      if (aiAdviceWrap) {
        aiAdviceWrap.classList.add('hidden');
        aiAdviceWrap.style.display = 'none';
      }
    }
  };

  const renderAIAdvice = (wrap) => {
    const sortedMedalists = [...state.vsBasket].sort((a, b) => b.safety_score - a.safety_score);
    
    wrap.innerHTML = `
      <div class="ai-judge-section" style="margin-top: 30px; border-top:1px solid var(--glass-border); padding-top:24px;">
        <h4 style="font-size: 16px; font-weight: 800; color: var(--accent-navy); margin-bottom:12px; text-align: center;">🤖 AI 추천 조언</h4>
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px; text-align: center;">수집된 결제 데이터 및 안심 투명도 점수를 기반으로 도출된 추천 등급입니다.</p>
        <div style="display:flex; gap:16px; flex-wrap:wrap; justify-content:center;">
          ${sortedMedalists.map((v, idx) => {
            const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
            const badges = ["🥇 금메달 (1등 추천)", "🥈 은메달 (2등 추천)", "🥉 동메달 (3등 추천)"];
            return `
              <div style="flex:1; min-width:180px; max-width:240px; background:var(--bg-card); border: 1px solid var(--glass-border); border-top: 4px solid ${colors[idx]}; border-radius:12px; padding:16px; box-shadow: 0 4px 12px rgba(0,0,0,0.01);">
                <div style="font-size:12px; font-weight:800; color:${colors[idx]}; margin-bottom:6px;">${badges[idx]}</div>
                <h6 style="font-size:14px; font-weight:800; margin-bottom:4px;">${v.vendor_name}</h6>
                <div style="font-size:13px; font-weight:700; color:var(--accent-blue); margin-bottom:8px;">투명도: ${v.safety_score}점 (${v.transparency_label})</div>
                <p style="font-size:11px; color:var(--text-secondary); line-height:1.4;">${v.ai_analysis.notes[0] || '견적이 매우 투명하며, 지출 오차가 적습니다.'}</p>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  };

  const handleCardClick = (cardEl, vendor) => {
    // Disable interactions
    activeSlotsContainer.style.pointerEvents = 'none';

    const allCards = activeSlotsContainer.querySelectorAll('.yugioh-card.filled');
    allCards.forEach(c => {
      if (c === cardEl) {
        c.classList.add('card-chosen');
      } else {
        c.classList.add('card-burned');
      }
    });

    const aiAdviceWrap = document.getElementById('ai-advice-wrap');
    if (aiAdviceWrap) {
       aiAdviceWrap.style.opacity = '0';
       aiAdviceWrap.style.transition = 'opacity 0.5s';
    }

    // Wait for animation (approx 1.5s)
    setTimeout(() => {
      activeSlotsContainer.style.pointerEvents = 'auto';
      selectFinalVendor(vendor);
    }, 1500);
  };

  const selectFinalVendor = (vendor) => {
    state.chosenVendor = vendor;
    localStorage.setItem('kkaboni_chosen_vendor', JSON.stringify(vendor));
    showToast(`👑 ${vendor.vendor_name} 최종 결정 완료! 결혼 가보자!`);
    
    // Switch to tab D
    setTimeout(() => {
      switchTab('tab-d');
    }, 1000);
  };

  // --- TAB C: 후기 까보자! LOGIC ---
  const renderTabCList = () => {
    reviewsContainer.innerHTML = '';
    const q = reviewSearchInput.value.toLowerCase().trim();
    
    const filtered = state.reviews.filter(r => r.vendor_name.toLowerCase().includes(q));
    
    if (filtered.length === 0) {
      reviewsContainer.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-secondary);">검증된 후기가 없습니다.</div>';
      return;
    }

    filtered.forEach(rev => {
      const item = document.createElement('div');
      item.className = 'review-title-item';
      item.style.position = 'relative'; // Required for absolute positioning of delete button
      
      let starsText = '★'.repeat(rev.stars) + '☆'.repeat(5 - rev.stars);
      let summaryText = `"${rev.content.substring(0, 20)}... 친절해요"`; // AI Summary mock
      
      item.innerHTML = `
        <button class="review-delete-btn" data-id="${rev.id}" title="후기 삭제">✕</button>
        <div class="review-title-header" style="padding-right: 30px;">
          <div>
            <div class="review-title-text">${rev.vendor_name}</div>
            <div class="review-summary-preview">${summaryText}</div>
          </div>
          <div style="text-align: right;">
            <div class="review-title-meta">${starsText} | AI ${rev.clean_score}점</div>
            <div class="expand-indicator" style="font-size:12px; color:var(--text-secondary); margin-top:4px;">▼ 펼치기</div>
          </div>
        </div>
        <div class="accordion-content">
          <div class="accordion-detail-text">${rev.content}</div>
          ${rev.proof_image ? `<img src="${rev.proof_image}" class="accordion-proof-img" alt="인증 자료">` : ''}
        </div>
      `;

      item.addEventListener('click', (e) => {
        // Prevent expanding/collapsing when clicking the delete button
        if (e.target.classList.contains('review-delete-btn')) return;
        
        item.classList.toggle('expanded');
        const arrow = item.querySelector('.expand-indicator');
        if (item.classList.contains('expanded')) {
          arrow.innerText = '▲ 접기';
        } else {
          arrow.innerText = '▼ 펼치기';
        }
      });

      // Delete Button Logic
      const delBtn = item.querySelector('.review-delete-btn');
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.reviews = state.reviews.filter(r => r.id !== rev.id);
        localStorage.setItem('kkaboni_reviews', JSON.stringify(state.reviews));
        renderTabCList();
      });

      reviewsContainer.appendChild(item);
    });
  };

  // Textarea length check
  reviewContentInput.addEventListener('input', () => {
    const len = reviewContentInput.value.length;
    charCounter.innerText = `${len} / 500`;
  });

  // Dummy Test Button Handler
  const dummyTestBtn = document.getElementById('dummy-test-btn');
  if (dummyTestBtn) {
    dummyTestBtn.addEventListener('click', () => {
      document.getElementById('review-vendor-name').value = "강남 블랑 스튜디오";
      reviewContentInput.value = "결제금액 300만원 계약 완료. 원본 필수 구매가 30만원으로 비싸지만 사진 퀄리티는 매우 좋습니다. 본식 당일 이모님 헬퍼비는 20만원 별도로 지급했습니다.";
      charCounter.innerText = `${reviewContentInput.value.length} / 500`;
      
      // Simulate file upload bypassing by setting a global flag or simulating click
      window._dummyReviewPass = true;
      showToast("더미 데이터 세팅 및 강제 통과 플래그 켜짐!");
    });
  }

  // --- C TAB AUTH UX LOGIC ---
  const authOverlayContainer = document.getElementById('auth-overlay-container');
  const startAuthBtn = document.getElementById('start-auth-btn');
  const authChoices = document.getElementById('auth-choices');
  const btnRealReceipt = document.getElementById('btn-real-receipt');
  const btnTestPass = document.getElementById('btn-test-pass');
  const btnTestFail = document.getElementById('btn-test-fail');
  const reviewImageInput = document.getElementById('review-image');
  const authLoading = document.getElementById('auth-loading');
  const authResultMsg = document.getElementById('auth-result-msg');
  const reviewFieldset = document.getElementById('review-fieldset');

  if (startAuthBtn) {
    // Step 1: Click the big yellow button
    startAuthBtn.addEventListener('click', () => {
      startAuthBtn.classList.add('hidden');
      authChoices.classList.remove('hidden');
    });

    // Step 2: Test Pass
    btnTestPass.addEventListener('click', () => {
      authChoices.classList.add('hidden');
      authLoading.classList.remove('hidden');
      authResultMsg.classList.add('hidden');
      
      setTimeout(() => {
        authLoading.classList.add('hidden');
        authResultMsg.className = 'auth-result-msg success';
        authResultMsg.innerText = '인증되었습니다 (100점)';
        authResultMsg.style.color = '#10B981';
        authResultMsg.classList.remove('hidden');
        
        window._dummyReviewPass = true;
        reviewFieldset.removeAttribute('disabled');
        
        setTimeout(() => {
           authOverlayContainer.classList.add('hidden');
        }, 1500);
      }, 800);
    });

    // Step 3: Test Fail
    btnTestFail.addEventListener('click', () => {
      authChoices.classList.add('hidden');
      authLoading.classList.remove('hidden');
      authResultMsg.classList.add('hidden');
      
      setTimeout(() => {
        authLoading.classList.add('hidden');
        authResultMsg.className = 'auth-result-msg fail';
        authResultMsg.innerHTML = '인증 실패!<br><span style="font-size:14px;font-weight:normal;color:white;">금액 정보가 일치하지 않거나, 화질이 불량하여 영수증 내역을 확인할 수 없습니다.</span>';
        authResultMsg.style.color = '#EF4444';
        authResultMsg.classList.remove('hidden');
        
        // Show start button again
        setTimeout(() => {
          authResultMsg.classList.add('hidden');
          startAuthBtn.innerText = '다시 시도하기';
          startAuthBtn.classList.remove('hidden');
        }, 3000);
      }, 800);
    });

    // Step 4: Real Receipt
    btnRealReceipt.addEventListener('click', () => {
      reviewImageInput.click();
    });

    reviewImageInput.addEventListener('change', () => {
      if (reviewImageInput.files.length > 0) {
        authChoices.classList.add('hidden');
        authLoading.classList.remove('hidden');
        authResultMsg.classList.add('hidden');
        
        setTimeout(() => {
          authLoading.classList.add('hidden');
          
          const file = reviewImageInput.files[0];
          let isPass = true;
          if (file.name.includes('fail')) isPass = false; // Mock failing logic
          
          if (isPass) {
            authResultMsg.className = 'auth-result-msg success';
            authResultMsg.innerText = '인증되었습니다 (실제 영수증 확인 완료)';
            authResultMsg.style.color = '#10B981';
            authResultMsg.classList.remove('hidden');
            
            reviewFieldset.removeAttribute('disabled');
            
            setTimeout(() => {
               authOverlayContainer.classList.add('hidden');
            }, 1500);
          } else {
            authResultMsg.className = 'auth-result-msg fail';
            authResultMsg.innerHTML = '인증 실패!<br><span style="font-size:14px;font-weight:normal;color:white;">업체명 또는 금액 정보가 누락되었습니다.</span>';
            authResultMsg.style.color = '#EF4444';
            authResultMsg.classList.remove('hidden');
            
            setTimeout(() => {
              authResultMsg.classList.add('hidden');
              startAuthBtn.innerText = '다시 시도하기';
              startAuthBtn.classList.remove('hidden');
            }, 3000);
            reviewImageInput.value = "";
          }
        }, 2000);
      }
    });
  }

  // Review Form Submit (Agent 4 validation)
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const vendorName = document.getElementById('review-vendor-name').value;
    const content = reviewContentInput.value;
    const imageFile = document.getElementById('review-image').files[0];
    
    // Get Rating
    const checkedStar = document.querySelector('input[name="rating"]:checked');
    const stars = checkedStar ? parseInt(checkedStar.value) : 5;

    aiReviewFeedback.className = 'ai-feedback hidden';
    aiReviewFeedback.innerHTML = `Zero-Viral AI 영수증/계약서 Vision 심사 중...`;
    aiReviewFeedback.classList.remove('hidden');

    try {
      let result;
      if (window._dummyReviewPass) {
        result = { status: "Verified", ai_clean_score: 100, reason: "더미 패스 통과" };
        window._dummyReviewPass = false;
      } else {
        result = await window.Agent4.analyzeReview(content, vendorName, imageFile);
      }
      
      if (result.status === "Verified") {
        aiReviewFeedback.className = 'ai-feedback feedback-verified';
        aiReviewFeedback.innerHTML = `<strong>✨ [인증 완료] 클린 커뮤니티에 등록되었습니다!</strong><br><span style="font-size:13px;">클린 지수: ${result.ai_clean_score}점 | 세부 분석: ${result.reason}</span>`;
        
        // Read file to data url if exists (dummy might not have it)
        const addReviewData = (imgUrl) => {
          const newReview = {
            id: Date.now(),
            vendor_name: vendorName,
            stars: stars,
            clean_score: result.ai_clean_score,
            content: content,
            proof_image: imgUrl
          };

          state.reviews.unshift(newReview);
          localStorage.setItem('kkaboni_reviews', JSON.stringify(state.reviews));
          
          setTimeout(() => {
            reviewForm.reset();
            charCounter.innerText = "0 / 500";
            aiReviewFeedback.classList.add('hidden');
            renderTabCList();
            
            // C -> A realtime update logic
            const targetVendorObj = window.VENDOR_DB.find(v => v.vendor_name === vendorName);
            if (targetVendorObj) {
               // Update DB score artificially to show real-time effect
               if (targetVendorObj.fixed_score) {
                 targetVendorObj.fixed_score = Number(Math.min(10, targetVendorObj.fixed_score + 0.5).toFixed(1));
               } else {
                 targetVendorObj.disputes = Math.max(0, targetVendorObj.disputes - 1);
               }
               // Trigger re-search for the current active region to refresh A tab list
               const currentRegion = document.getElementById('region').value;
               if (currentRegion) doSearch(currentRegion);
               
               showToast(`${vendorName}의 안심 지수가 실시간으로 상승했습니다!`);
            }
          }, 2000);
        };

        if (imageFile) {
          const reader = new FileReader();
          reader.onload = (event) => addReviewData(event.target.result);
          reader.readAsDataURL(imageFile);
        } else {
          // Dummy pass image
          addReviewData("https://images.unsplash.com/photo-1555529733-0e670560f7e1?w=500&auto=format&fit=crop");
        }

      } else {
        aiReviewFeedback.className = 'ai-feedback feedback-rejected';
        aiReviewFeedback.innerHTML = `<strong>❌ [인증 반려] 심사에 통과하지 못했습니다.</strong><br><span style="font-size:13px;">클린 지수: ${result.ai_clean_score}점 (70점 미만)<br>사유: ${result.reason}</span>`;
      }
    } catch (err) {
      aiReviewFeedback.className = 'ai-feedback feedback-rejected';
      aiReviewFeedback.innerText = "검증 도중 예상치 못한 에러가 발생했습니다.";
    }
  });

  reviewSearchInput.addEventListener('input', () => {
    renderTabCList();
  });

  const openReviewDetail = (review) => {
    detailVendorName.innerText = review.vendor_name;
    detailStars.innerText = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
    detailCleanScore.innerText = review.clean_score;
    detailTextBody.innerText = review.content;
    detailProofImage.src = review.proof_image;

    communityMainView.classList.add('hidden');
    reviewDetailView.classList.remove('hidden');
  };

  reviewBackBtn.addEventListener('click', () => {
    communityMainView.classList.remove('hidden');
    reviewDetailView.classList.add('hidden');
  });

  // --- TAB D: 결혼 가보자! LOGIC (Budget Calculator) ---
  const calculateBudget = () => {
    const selects = document.querySelectorAll('.calc-select');
    let totalBase = 0;
    let selectedValues = {};
    selects.forEach(select => {
      const val = parseInt(select.value) || 0;
      totalBase += val;
      selectedValues[select.id] = val;
    });
    
    localStorage.setItem('kkaboni_calc_values', JSON.stringify(selectedValues));
    
    // 평균 꼼수 추가금 20% 가산 시뮬레이션
    const additionalFee = Math.round(totalBase * 0.20);
    const totalExpected = totalBase + additionalFee;
    
    const totalPriceEl = document.getElementById('calc-total-price');
    if (totalPriceEl) {
      totalPriceEl.innerText = formatCurrency(totalExpected);
    }
    
    const badgeContainer = document.getElementById('calc-badge-container');
    if (badgeContainer) {
      badgeContainer.innerHTML = '';
      if (totalExpected === 0) return;
      
      const badge = document.createElement('span');
      badge.className = 'transparency-badge ';
      
      if (totalExpected < 15000000) {
        badge.className += 'score-very-transparent';
        badge.innerText = '평균보다 매우 저렴 (Below Average)';
      } else if (totalExpected <= 30000000) {
        badge.className += 'score-transparent';
        badge.innerText = '평균 예산 수준 (Average)';
      } else {
        badge.className += 'score-warning';
        badge.innerText = '평균보다 높음 (Above Average)';
      }
      badgeContainer.appendChild(badge);
    }
  };

  const loadCalculatorFromStorage = () => {
    const saved = localStorage.getItem('kkaboni_calc_values');
    if (saved) {
      const vals = JSON.parse(saved);
      for (const id in vals) {
        const el = document.getElementById(id);
        if (el) el.value = vals[id];
      }
    }
    calculateBudget();
  };

  const renderTabD = () => {
    loadCalculatorFromStorage();
    planNotesTextarea.value = state.planNotes;
    
    // Render chosen final vendor card if exists in Pokemon/FIFA Style
    const chosenCardContainer = document.getElementById('tab-d-chosen-card-container');
    if (chosenCardContainer) {
      chosenCardContainer.innerHTML = '';
      if (state.chosenVendor) {
        const v = state.chosenVendor;
        const cardDiv = document.createElement('div');
        cardDiv.className = `yugioh-card filled ${v.transparency_class}`;
        cardDiv.style.backgroundImage = `url('${v.images[0]}')`;
        cardDiv.style.margin = '0 auto 20px auto';
        cardDiv.style.maxWidth = '320px';
        cardDiv.style.height = '490px';
        
        cardDiv.innerHTML = `
          <div class="yugioh-card-inner" style="z-index: 2; position: relative; height: 100%; display: flex; flex-direction: column;">
            <div class="yugioh-card-header" style="justify-content: space-between; align-items: flex-start; display: flex; margin-bottom: 8px;">
              <h3 class="yugioh-vendor-name" style="color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.8); margin: 0; font-size:18px; font-weight:800;">${v.vendor_name}</h3>
              <span class="yugioh-transparency badge-${v.transparency_class}">${v.transparency_label}</span>
            </div>
            
            <div class="radar-chart-wrap" style="display:flex; justify-content:center; align-items:center; margin: 10px 0; height: 130px; position: relative;"></div>
            
            <div class="yugioh-card-body" style="margin-top: auto; color: white;">
              <div class="yugioh-stat-row" style="margin-bottom: 4px; font-size:12px;">
                <span class="yugioh-stat-label" style="color: #DDD;">기본 패키지</span>
                <span class="yugioh-stat-value" style="font-weight:700;">${formatCurrency(v.base_price)}</span>
              </div>
              <div class="yugioh-stat-row" style="margin-bottom: 4px; font-size:12px;">
                <span class="yugioh-stat-label" style="color: #DDD;">예상 추가금</span>
                <span class="yugioh-stat-value" style="color:#FFA500; font-weight:700;">+${formatCurrency(v.total_hidden_cost)}</span>
              </div>
              <hr class="yugioh-divider" style="margin: 8px 0; border: 0; border-top: 1px solid rgba(255,255,255,0.2);" />
              <div class="yugioh-stat-row total-row" style="margin-bottom: 8px;">
                <span class="yugioh-stat-label" style="color: #FFF; font-weight: 800;">실제 예상 총액</span>
                <span class="yugioh-stat-value" style="color:#FBBF24; font-size: 18px; font-weight: 900;">${formatCurrency(v.total_price)}</span>
              </div>
              <div class="card-details-box" style="font-size: 11px; background: rgba(0,0,0,0.65); padding: 8px; border-radius: 8px; line-height: 1.4; text-align: left;">
                <div>🟢 <strong>장점:</strong> ${v.ai_analysis.pros[0] || '우수한 피드백'}</div>
                <div>🔴 <strong>단점:</strong> ${v.ai_analysis.cons[0] || '예약 대기 필요'}</div>
              </div>
            </div>
          </div>
        `;
        
        // Append Radar Chart
        const radarContainer = cardDiv.querySelector('.radar-chart-wrap');
        const radarSvg = generateRadarChart(120, 120, [v.stats], ['#FFF'], ['rgba(255, 255, 255, 0.25)']);
        // Add score in the center
        const centerX = 60;
        const centerY = 60;
        const centerText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        centerText.setAttribute("x", centerX);
        centerText.setAttribute("y", centerY);
        centerText.setAttribute("text-anchor", "middle");
        centerText.setAttribute("dominant-baseline", "middle");
        centerText.setAttribute("fill", "#FFFFFF");
        centerText.setAttribute("font-size", "14px");
        centerText.setAttribute("font-weight", "900");
        centerText.textContent = Math.round(v.safety_score * 10);
        radarSvg.appendChild(centerText);
        
        radarContainer.appendChild(radarSvg);
        chosenCardContainer.appendChild(cardDiv);
      } else {
        chosenCardContainer.innerHTML = `
          <div style="text-align:center; padding: 30px; border: 2px dashed var(--glass-border); border-radius: 12px; color: var(--text-secondary); font-size: 13px;">
            🥇 선택된 최종 파트너가 없습니다.<br>
            [맞짱 까보자!] 탭에서 최종 파트너를 선택해 주세요.
          </div>
        `;
      }
    }
  };

  goToABtn.addEventListener('click', () => {
    switchTab('tab-a');
  });

  savePlanBtn.addEventListener('click', () => {
    state.planNotes = planNotesTextarea.value;
    localStorage.setItem('kkaboni_plan_notes', state.planNotes);
    showToast('저장되었습니다');
  });

  // Budget Calculator Selectors Binding
  const calcSelects = document.querySelectorAll('.calc-select');
  calcSelects.forEach(select => {
    select.addEventListener('change', calculateBudget);
  });

  // Home Category Card Clicks Binding
  const homeCategoryCards = document.querySelectorAll('.category-card');
  homeCategoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      const itemSelect = document.getElementById('item');
      if (itemSelect) {
        itemSelect.value = category;
      }
      
      const regionSelect = document.getElementById('region');
      if (regionSelect && !regionSelect.value) {
        regionSelect.value = 'seoul';
      }
      
      if (!state.isLoggedIn) {
        showToast('로그인이 필요한 서비스입니다. 호갱 탈출을 위해 로그인해 주세요!');
        logoBtn.click();
        setTimeout(() => { landingStartBtn.click(); }, 300);
        return;
      }
      
      switchTab('tab-a');
      const region = regionSelect ? regionSelect.value : 'seoul';
      doSearch(region);
    });
  });

  // Guide Modal Logic
  const guideModalBtn = document.getElementById('guide-modal-btn');
  const guideModal = document.getElementById('guide-modal');
  const guideModalClose = document.getElementById('guide-modal-close');
  const guideActionBtn = document.getElementById('guide-action-btn');

  if (guideModalBtn) {
    guideModalBtn.addEventListener('click', () => {
      guideModal.classList.remove('hidden');
    });
  }
  if (guideModalClose) {
    guideModalClose.addEventListener('click', () => {
      guideModal.classList.add('hidden');
    });
  }
  if (guideActionBtn) {
    guideActionBtn.addEventListener('click', () => {
      guideModal.classList.add('hidden');
      if (!state.isLoggedIn) {
        showToast('가이드를 활용하려면 로그인해 주세요!');
        logoBtn.click();
        setTimeout(() => { landingStartBtn.click(); }, 300);
      } else {
        switchTab('tab-a');
      }
    });
  }

  // Init App Sync
  syncAuthUI();

  // Pre-fetch default data for Tab A so it's ready immediately
  doSearch('seoul').catch(() => {});
});
