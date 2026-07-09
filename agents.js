/**
 * AI Wedding Platform - Agent Simulation Logic (KKABONI Rebranded)
 */

const CATEGORIES = [
  { id: 'sdm', name: '스드메' },
  { id: 'hall', name: '웨딩홀' },
  { id: 'snap', name: '본식스냅' },
  { id: 'dvd', name: '본식영상' },
  { id: 'jewelry', name: '예물' },
  { id: 'suit', name: '예복' },
  { id: 'hanbok', name: '한복' }
];

const LOCATIONS = ['seoul', 'gyeonggi-n', 'gyeonggi-s', 'incheon', 'gangwon', 'chungbuk', 'chungnam', 'gyeongbuk', 'gyeongnam', 'jeonbuk', 'jeonnam', 'jeju'];

const generateDummyData = () => {
  const db = [];

  // Hardcoded Test Kit items
  db.push(
    {
      vendor_id: "v001", vendor_name: "강남 블랑 스튜디오", location: "seoul", item_type: "sdm",
      base_price: 3000000, hidden_costs: [
        { item_name: "추가금 필수 옵션", average_cost: 500000, is_mandatory: true, occurrence: 100 }
      ],
      fixed_score: 8.5, stats: { transparency: 17, satisfaction: 18, quality: 18, stability: 16, facility: 16 }, reviews_count: 82, images: ["https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=600&auto=format&fit=crop&q=60"], address: "서울특별시 강남구 논현동 11-2 1층", ai_analysis: { features: ["화사한 웨딩 사진"], pros: ["친절한 디렉팅"], cons: ["기본 가격선 존재"], notes: ["기본 패키지 대비 추가금이 표준 범위 내에 있음."] }, disputes: 0, toxic_clause: false
    },
    {
      vendor_id: "v002", vendor_name: "청담 메종 드레스", location: "seoul", item_type: "sdm",
      base_price: 1800000, hidden_costs: [
        { item_name: "추가금 필수 옵션", average_cost: 1000000, is_mandatory: true, occurrence: 100 }
      ],
      fixed_score: 5.5, stats: { transparency: 8, satisfaction: 11, quality: 18, stability: 10, facility: 14 }, reviews_count: 55, images: ["https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=60"], address: "서울특별시 강남구 청담동 55-4", ai_analysis: { features: ["고급 드레스 사진"], pros: ["직접 피팅 도와줌"], cons: ["추가금 비중 매우 높음"], notes: ["이 업체는 추가비용 요주의가 요구됩니다."] }, disputes: 2, toxic_clause: true
    },
    {
      vendor_id: "v003", vendor_name: "서초 라온홀", location: "seoul", item_type: "sdm",
      base_price: 24900000, hidden_costs: [
        { item_name: "추가금 필수 옵션", average_cost: 100000, is_mandatory: true, occurrence: 100 }
      ],
      fixed_score: 9.5, stats: { transparency: 19, satisfaction: 19, quality: 18, stability: 19, facility: 19 }, reviews_count: 120, images: ["https://images.unsplash.com/photo-1507504038482-7621c97a0f4a?w=600&auto=format&fit=crop&q=60"], address: "서울특별시 서초구 서초대로 321", ai_analysis: { features: ["밝은 웨딩홀 사진"], pros: ["편리한 교통"], cons: ["대관료 비중 높음"], notes: ["추가금이 거의 발생하지 않는 투명한 구조입니다."] }, disputes: 0, toxic_clause: false
    }
  );

  let idCounter = 4;

  CATEGORIES.forEach(cat => {
    for (let i = 0; i < 20; i++) {
      const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const reviews = Math.floor(Math.random() * 200) + 10;

      let basePrice = 0;
      let hiddenCosts = [];
      let vendorName = '';
      let features = [];
      let notes = '';

      if (cat.id === 'sdm') {
        vendorName = `블랑 스튜디오 ${i + 1}호점`;
        basePrice = Math.floor(Math.random() * 1000000) + 1500000;
        hiddenCosts = [
          { item_name: "드레스 업그레이드", average_cost: 450000, is_mandatory: false, occurrence: 85 },
          { item_name: "헬퍼 이모님", average_cost: 250000, is_mandatory: true, occurrence: 92 },
          { item_name: "메이크업 지정비", average_cost: 300000, is_mandatory: false, occurrence: 74 },
          { item_name: "원본 파일 구매", average_cost: 200000, is_mandatory: true, occurrence: 58 }
        ];
        features = ["세련된 컨셉", "친절한 디렉팅"];
        notes = "기본 패키지 대비 추가금 비율이 높은 편이니 유의하세요.";
      } else if (cat.id === 'hall') {
        vendorName = `라온 컨벤션 ${i + 1}`;
        basePrice = Math.floor(Math.random() * 8000000) + 15000000;
        hiddenCosts = [
          { item_name: "꽃장식 추가", average_cost: 1200000, is_mandatory: true, occurrence: 95 },
          { item_name: "음향 추가", average_cost: 300000, is_mandatory: false, occurrence: 80 }
        ];
        features = ["맛있는 식대", "높은 천고"];
        notes = "계약 가격과 실제 결제 비용의 차이가 적은 정직한 업체입니다.";
      } else if (cat.id === 'snap') {
        vendorName = `기억 스냅 ${i + 1}`;
        basePrice = Math.floor(Math.random() * 400000) + 500000;
        hiddenCosts = [
          { item_name: "보정본 추가", average_cost: 200000, is_mandatory: false, occurrence: 45 },
          { item_name: "원본 파일 구매", average_cost: 300000, is_mandatory: true, occurrence: 90 }
        ];
        features = ["감성 색감", "2인 작가"];
        notes = "스냅 사진 퀄리티가 우수하고 원본이 포함되지 않은 옵션이 있으니 확인 바람.";
      } else if (cat.id === 'dvd') {
        vendorName = `씨네마 웨딩 ${i + 1}`;
        basePrice = Math.floor(Math.random() * 300000) + 400000;
        hiddenCosts = [
          { item_name: "4K 화질 업그레이드", average_cost: 200000, is_mandatory: false, occurrence: 65 },
          { item_name: "폐백 촬영 추가", average_cost: 150000, is_mandatory: false, occurrence: 30 }
        ];
        features = ["영화 같은 편집"];
        notes = "기본 영상 편집 퀄리티가 뛰어나며 4K 업그레이드 옵션은 선택 사항입니다.";
      } else if (cat.id === 'jewelry') {
        vendorName = `다이아 부띠끄 ${i + 1}`;
        basePrice = Math.floor(Math.random() * 1500000) + 1000000;
        hiddenCosts = [
          { item_name: "다이아 등급 업그레이드", average_cost: 500000, is_mandatory: false, occurrence: 72 },
          { item_name: "가드링 추가", average_cost: 300000, is_mandatory: false, occurrence: 48 }
        ];
        features = ["평생 A/S", "디자인 다양"];
        notes = "가드링과 다이아몬드 품질 업그레이드에 따른 예상 추가금이 발생합니다.";
      } else if (cat.id === 'suit') {
        vendorName = `킹스맨 테일러 ${i + 1}`;
        basePrice = Math.floor(Math.random() * 600000) + 600000;
        hiddenCosts = [
          { item_name: "수입 원단 업그레이드", average_cost: 400000, is_mandatory: false, occurrence: 80 },
          { item_name: "수제 셔츠 추가", average_cost: 150000, is_mandatory: false, occurrence: 60 }
        ];
        features = ["완벽한 핏", "가봉 친절"];
        notes = "고급 수입 원단으로의 업그레이드 발생률이 다소 높습니다.";
      } else if (cat.id === 'hanbok') {
        vendorName = `고운 한복 ${i + 1}`;
        basePrice = Math.floor(Math.random() * 300000) + 300000;
        hiddenCosts = [
          { item_name: "혼주 노리개/뒤꽂이 추가", average_cost: 150000, is_mandatory: false, occurrence: 50 }
        ];
        features = ["고급 실크", "색감 우수"];
        notes = "장신구 세트 대여 비용이 투명하게 공개되어 있습니다.";
      } else if (cat.id === 'bouquet') {
        vendorName = `플로라 부케 ${i + 1}`;
        basePrice = Math.floor(Math.random() * 100000) + 100000;
        hiddenCosts = [
          { item_name: "수입 희귀 꽃 추가금", average_cost: 80000, is_mandatory: false, occurrence: 60 },
          { item_name: "코사지 개수 추가", average_cost: 50000, is_mandatory: false, occurrence: 40 }
        ];
        features = ["신선한 생화", "감각적인 매칭"];
        notes = "계절 꽃 이외의 수입 꽃 지정 시 추가 비용이 있습니다.";
      } else if (cat.id === 'invitation') {
        vendorName = `카드 마켓 ${i + 1}`;
        basePrice = Math.floor(Math.random() * 100000) + 100000;
        hiddenCosts = [
          { item_name: "초안 디자인 수정 추가금", average_cost: 30000, is_mandatory: false, occurrence: 35 },
          { item_name: "특수 봉투 스티커 업그레이드", average_cost: 20000, is_mandatory: false, occurrence: 42 }
        ];
        features = ["모바일 무료", "깔끔한 패키지"];
        notes = "대부분 기본형 봉투를 선택하며, 추가금 발생 빈도가 매우 낮습니다.";
      } else if (cat.id === 'furniture') {
        vendorName = `까사 인테리어 ${i + 1}`;
        basePrice = Math.floor(Math.random() * 3000000) + 2000000;
        hiddenCosts = [
          { item_name: "사다리차 이용료", average_cost: 150000, is_mandatory: true, occurrence: 90 },
          { item_name: "지방 배송 추가비", average_cost: 100000, is_mandatory: false, occurrence: 20 }
        ];
        features = ["모던 가구", "친환경 소재"];
        notes = "배송 위치에 따른 물류비 및 사다리차 필수 비용을 미리 파악하세요.";
      } else if (cat.id === 'honeymoon') {
        vendorName = `투어 플러스 ${i + 1}`;
        basePrice = Math.floor(Math.random() * 3000000) + 3000000;
        hiddenCosts = [
          { item_name: "유류할증료 및 가이드 팁", average_cost: 300000, is_mandatory: true, occurrence: 98 },
          { item_name: "현지 액티비티 패키지", average_cost: 200000, is_mandatory: false, occurrence: 65 }
        ];
        features = ["단독 가이드", "최고급 리조트"];
        notes = "현지 필수 가이드 경비와 유류할증료 변동에 관한 고지 사항을 꼭 보세요.";
      }

      db.push({
        vendor_id: `v${idCounter++}`,
        vendor_name: vendorName,
        location: loc,
        item_type: cat.id,
        base_price: basePrice,
        hidden_costs: hiddenCosts,
        raw_schema: {},
        stats: {
          transparency: Math.floor(Math.random() * 10) + 10,
          satisfaction: Math.floor(Math.random() * 10) + 10,
          quality: Math.floor(Math.random() * 10) + 10,
          stability: Math.floor(Math.random() * 10) + 10,
          facility: Math.floor(Math.random() * 10) + 10
        },
        reviews_count: reviews,
        images: ["https://images.unsplash.com/photo-1519225495810-7512c696505a?w=600&auto=format&fit=crop&q=60"],
        address: `${loc.toUpperCase()} 어딘가 123-4`,
        ai_analysis: {
          features: features,
          pros: ["가격 대비 성능이 준수함", "응대가 빠름"],
          cons: ["성수기 예약 어려움"],
          notes: ["인기 업체이므로 서두르세요."]
        },
        disputes: Math.floor(Math.random() * 2),
        toxic_clause: Math.random() > 0.8
      });
    }
  });

  return db;
};

const VENDOR_DB = generateDummyData();

// Agent 2: 수집 및 정형화 (Data Fetching & Filtering)
window.Agent2 = {
  fetchData: async (region, itemType, budgetLimit) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = VENDOR_DB;
        if (region) {
          filtered = filtered.filter(v => v.location === region);
        }
        if (itemType) {
          filtered = filtered.filter(v => v.item_type === itemType);
        }
        resolve(filtered);
      }, 100); // 100ms for simulated db fetch
    });
  }
};

// Agent 3: 추가 비용 요약 및 스코어링 (AI Estimation)
window.Agent3 = {
  analyzeQuotes: async (vendors) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const analyzedData = vendors.map(vendor => {
            let total_hidden_cost = 0;
            vendor.hidden_costs.forEach(cost => {
              total_hidden_cost += cost.average_cost;
            });

            const total_price = vendor.base_price + total_hidden_cost;
            const hidden_ratio = (total_hidden_cost / vendor.base_price) * 100;

            // 안심 지수 (10점 만점 기준 환산, Transparency Score)
            let safety_score = 10;
            if (vendor.fixed_score) {
              safety_score = vendor.fixed_score;
            } else {
              if (hidden_ratio >= 40) safety_score -= 3;
              else if (hidden_ratio >= 20) safety_score -= 1.5;

              if (vendor.toxic_clause) safety_score -= 2.5;
              if (vendor.disputes > 0) safety_score -= (vendor.disputes * 0.8);
            }

            safety_score = Math.max(1, Math.min(10, Number(safety_score.toFixed(1))));

            // 투명도 등급 판별 (9.0 안심, 7.5 양호, 6.0 미흡, 6.0미만 위험)
            let transparency_label = "미흡";
            let transparency_class = "score-average";

            if (safety_score >= 9.0) {
              transparency_label = "안심";
              transparency_class = "score-very-transparent";
            } else if (safety_score >= 7.5) {
              transparency_label = "양호";
              transparency_class = "score-transparent";
            } else if (safety_score >= 6.0) {
              transparency_label = "미흡";
              transparency_class = "score-average";
            } else {
              transparency_label = "위험";
              transparency_class = "score-warning";
            }

            return {
              ...vendor,
              total_hidden_cost: total_hidden_cost,
              total_price: total_price,
              hidden_ratio: hidden_ratio.toFixed(1),
              safety_score: safety_score,
              transparency_label: transparency_label,
              transparency_class: transparency_class
            };
          });

          resolve(analyzedData);
        } catch (e) {
          reject("Agent 3 파싱/연산 오류 발생 (Fallback Triggered)");
        }
      }, 1500);
    });
  }
};

// Agent 4: 광고 방어 및 검증 (Zero-Viral NLP & Vision Crosscheck Simulation)
window.Agent4 = {
  analyzeReview: async (content, vendorName, imageFile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let score = 50; // 기본 점수
        let reason = [];

        // [Cut 1] 증빙 이미지 판독 및 크로스체크 시뮬레이션
        if (!imageFile) {
          return resolve({
            ai_clean_score: 0,
            status: "Rejected",
            reason: "증빙 이미지 자료(영수증/계약서 캡처본)가 첨부되지 않았습니다."
          });
        }

        // 리뷰 내용과 영수증 크로스체크 (금액/수치가 없는 경우 불일치 반려)
        const digits = content.match(/\d+/g);
        const hasPriceKeywords = /만원|원|결제|금액/.test(content);

        if (!digits || !hasPriceKeywords) {
          return resolve({
            ai_clean_score: 10,
            status: "Rejected",
            reason: "증빙 자료와 리뷰 내용이 일치하지 않습니다. (상세 결제 금액 및 결제 내역 텍스트 미발견)"
          });
        }

        // [Cut 2] 마이크로 디테일 검사 (이모님 성함, 추가금 항목 등)
        const microDetails = ["이모", "액자", "추가금", "셀렉", "원본", "수정본", "피팅", "메이크업", "원판"];
        const hasMicroDetail = microDetails.some(kw => content.includes(kw));

        if (!hasMicroDetail) {
          score -= 30;
          reason.push("마이크로 디테일(직원 성함, 구체적 추가금 명세 등) 부족 (-30)");
        } else {
          score += 20;
          reason.push("마이크로 디테일 확인됨 (+20)");
        }

        // 기타 NLP 평점 조정
        const negativeKeywords = ["아쉽", "비싸", "불친절", "추가금", "별로", "단점", "위약금"];
        const hasNegative = negativeKeywords.some(kw => content.includes(kw));
        if (!hasNegative) {
          score -= 15;
          reason.push("단점 언급 전무 (-15)");
        } else {
          score += 15;
          reason.push("장단점 균형 양호 (+15)");
        }

        const excessivePraiseCount = (content.match(/너무|최고|완벽|친절|진짜/g) || []).length;
        if (excessivePraiseCount >= 4) {
          score -= 25;
          reason.push("과도한 형용사 및 칭찬 남발 (-25)");
        } else {
          score += 10;
          reason.push("홍보성 칭찬 지수 클린 (+10)");
        }

        // 점수 바운딩
        score = Math.max(0, Math.min(100, score));
        const status = score >= 70 ? "Verified" : "Rejected";

        resolve({
          ai_clean_score: score,
          status: status,
          reason: reason.join(", ")
        });
      }, 2000); // 2초 정밀 심사 시뮬레이션
    });
  }
};

window.Agent2 = Agent2;
window.Agent3 = Agent3;
window.Agent4 = Agent4;
window.VENDOR_DB = VENDOR_DB;
