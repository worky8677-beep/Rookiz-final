/**
 * 눈 보호 상태 정의 — EyeGuard / EyeGuardWidget 공용
 */
export const EYE_STATUS = {
  noface: {
    icon: "?",
    text: "얼굴이 감지되지 않습니다",
    label: "얼굴 없음",
  },
  ok: {
    icon: "✓",
    text: "적정 거리입니다",
    label: "안전",
  },
  caution: {
    icon: "!",
    text: "조금 멀어지세요",
    label: "주의",
  },
  danger: {
    icon: "⚠",
    text: "너무 가깝습니다!\n화면에서 멀어지세요",
    label: "너무 가까움",
  },
  loading: {
    icon: "⏳",
    text: "모델 로딩 중...",
    label: "로딩 중",
  },
};

/** 상태별 텍스트 색상 클래스 */
export const STATUS_TEXT = {
  noface: "text-status-inactive",
  ok: "text-status-ok",
  caution: "text-status-caution",
  danger: "text-status-danger",
  loading: "text-status-loading",
};

/** 상태별 배경 색상 클래스 (7% 불투명도) */
export const STATUS_BG_LIGHT = {
  noface: "bg-status-inactive/7",
  ok: "bg-status-ok/7",
  caution: "bg-status-caution/7",
  danger: "bg-status-danger/7",
  loading: "bg-status-loading/7",
};

/** 상태별 테두리 색상 클래스 (27% 불투명도) */
export const STATUS_BORDER = {
  noface: "border-status-inactive/27",
  ok: "border-status-ok/27",
  caution: "border-status-caution/27",
  danger: "border-status-danger/27",
  loading: "border-status-loading/27",
};

/** 게이지 배경 클래스 (danger→빨강, caution→노랑, 나머지→초록) */
export const GAUGE_BG = {
  noface: "bg-status-ok",
  ok: "bg-status-ok",
  caution: "bg-status-caution",
  danger: "bg-status-danger",
  loading: "bg-status-ok",
};
