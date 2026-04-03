import { useState } from "react";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { StepIndicator } from "../components/StepIndicator";
import { LoginCharacter } from "../components/LoginCharacter";
import { LoginInput } from "../components/LoginInput";
import { Button } from "../components/Button";

/* ── Step 1: 계정 생성 ────────────────────────────────── */
function StepIntro({ form, onChange, onNext }) {
  const isValid = form.name.trim() && form.email.trim() && form.password.trim();

  return (
    <div className="flex flex-col items-center w-full max-w-onboard-sm px-4 gap-5 pb-25">
      <LoginCharacter />

      <LoginInput
        label="이름"
        placeholder="아이 또는 부모님 이름"
        value={form.name}
        onChange={onChange("name")}
      />
      <LoginInput
        label="이메일"
        placeholder="이메일 주소"
        type="email"
        value={form.email}
        onChange={onChange("email")}
      />
      <LoginInput
        label="비밀번호"
        placeholder="비밀번호"
        type="password"
        value={form.password}
        onChange={onChange("password")}
      />

      <Button variant="primary" active={!!isValid} onClick={onNext}>
        시작하기
      </Button>

      <p className="text-xs text-gray-400">
        이미 계정이 있으신가요?{" "}
        <span className="font-bold text-primary-500 cursor-pointer">로그인</span>
      </p>
    </div>
  );
}

/* ── Step 2: 연령 선택 ────────────────────────────────── */
const AGE_CARDS = [
  {
    id: "kids",
    label: "키즈",
    age: "4 ~ 7세",
    desc: ["따뜻하고 안전한", "귀여운 콘텐츠 세계"],
    features: ["동화 & 애니메이션", "기초 학습 콘텐츠", "안심 세이프 필터"],
  },
  {
    id: "junior",
    label: "주니어",
    age: "8 ~ 12세",
    desc: ["도전과 창의력을", "키우는 모험의 세계"],
    features: ["드라마 & 예능", "심화 학습 콘텐츠", "미션 & 퀴즈"],
  },
];

function AgeCard({ card, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(card.id)}
      className={twMerge(
        "bg-white border-2 rounded-3xl shadow-card p-6 pb-2 w-age-card flex flex-col items-start gap-4 cursor-pointer transition-colors",
        selected ? "border-primary-500" : "border-gray-100 hover:border-gray-300"
      )}
    >
      {/* 헤더 */}
      <div>
        <p className="text-base font-extrabold text-gray-700 text-left">{card.label}</p>
        <p className="text-2xl font-extrabold text-gray-500 leading-6">{card.age}</p>
      </div>

      {/* 설명 */}
      <div className="text-sm font-medium text-gray-400 text-left leading-2">
        {card.desc.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      {/* 특징 리스트 */}
      <div className="flex flex-col gap-2">
        {card.features.map((feat) => (
          <div key={feat} className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircleCheck} className="text-xs text-gray-300" />
            <span className="text-xs font-semibold text-gray-400">{feat}</span>
          </div>
        ))}
      </div>

      {/* 선택됨 표시 */}
      <div className="w-full border-t border-gray-400 pt-2 flex items-center justify-center gap-2">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className={twMerge("text-xs", selected ? "text-primary-500" : "text-gray-400")}
        />
        <span
          className={twMerge(
            "text-xs font-bold",
            selected ? "text-primary-500" : "text-gray-400"
          )}
        >
          선택됨
        </span>
      </div>
    </button>
  );
}

function BackBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-bold text-gray-500 cursor-pointer hover:text-gray-700 transition-colors self-start"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
      이전
    </button>
  );
}

function StepAgeSelect({ selected, onSelect, onNext, onBack }) {
  return (
    <div className="flex flex-col items-center w-full max-w-onboard-md px-4 gap-6 pb-25">
      <BackBtn onClick={onBack} />
      {/* 제목 */}
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-blue-950 leading-6">
          아이의 연령대 카드를 선택해주세요
        </h2>
        <p className="text-sm font-medium text-gray-500 mt-2">
          맞춤 콘텐츠와 세이프 필터가 적용됩니다
        </p>
      </div>

      {/* 카드 */}
      <div className="flex gap-4">
        {AGE_CARDS.map((card) => (
          <AgeCard
            key={card.id}
            card={card}
            selected={selected === card.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      <Button variant="primary" active={!!selected} showArrow onClick={onNext}>
        다음
      </Button>
    </div>
  );
}

/* ── Step 3: AI 인사 ──────────────────────────────────── */
function StepGreeting({ ageGroup, onNext, onBack }) {
  const title = ageGroup === "kids" ? "안녕 나는 아기 루야" : "안녕 나는 꼬마 루야";

  return (
    <div className="flex flex-col items-center w-full max-w-onboard-md px-4 gap-6 pb-25">
      <BackBtn onClick={onBack} />
      <LoginCharacter
        title={`"${title}"`}
        subtitle={null}
      />

      {/* 페이지네이션 도트 */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-2 rounded-full bg-primary-500" />
        <div className="size-2 rounded-full bg-gray-100" />
        <div className="size-2 rounded-full bg-gray-100" />
      </div>

      <Button variant="primary" active showArrow onClick={onNext}>
        다음
      </Button>
    </div>
  );
}

/* ── 메인 온보딩 페이지 ───────────────────────────────── */
export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [ageGroup, setAgeGroup] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const goNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate(ageGroup === "kids" ? "/home" : "/junior");
    }
  };

  return (
    <div
      className={twMerge(
        "min-h-screen flex flex-col items-center bg-radial-[at_center_top] to-gray-50",
        step === 3 && ageGroup === "kids"
          ? "from-green-100"
          : step === 3 && ageGroup === "junior"
            ? "from-blue-100"
            : "from-primary-100"
      )}
    >
      {/* 로고 */}
      <div className="py-6">
        <img src="/LOGO.svg" alt="ROOKIZ" className="h-12" />
      </div>

      {/* 스텝 인디케이터 */}
      <StepIndicator current={step} className="mb-6" />

      {/* 콘텐츠 */}
      <div className="flex-1 flex items-start justify-center pt-6">
        {step === 1 && (
          <StepIntro form={form} onChange={handleChange} onNext={goNext} />
        )}
        {step === 2 && (
          <StepAgeSelect selected={ageGroup} onSelect={setAgeGroup} onNext={goNext} onBack={goBack} />
        )}
        {step === 3 && <StepGreeting ageGroup={ageGroup} onNext={goNext} onBack={goBack} />}
      </div>
    </div>
  );
}
