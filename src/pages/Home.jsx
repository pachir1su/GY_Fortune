import { useNavigate } from "react-router-dom";
import { useFortuneStore } from "../store/useFortuneStore.js";
import TimeSelect from "../components/TimeSelect.jsx";

function digitsOnly(s = "") {
  return (s || "").replace(/\D+/g, "");
}
function fmtYYYYMMDD(digits) {
  const s = digitsOnly(digits).slice(0, 8);
  if (s.length <= 4) return s;
  if (s.length <= 6) return s.slice(0, 4) + "." + s.slice(4);
  return s.slice(0, 4) + "." + s.slice(4, 6) + "." + s.slice(6, 8);
}
function toHyphenDate(digits) {
  const s = digitsOnly(digits);
  if (s.length !== 8) return "";
  return s.slice(0, 4) + "-" + s.slice(4, 6) + "-" + s.slice(6, 8);
}

export default function Home() {
  const nav = useNavigate();
  const {
    name,
    birth,
    setName,
    setBirth,
    calendarType,
    setCalendarType,
    birthTime,
    setBirthTime,
  } = useFortuneStore();

  const digits = digitsOnly(birth);
  const hyphen = toHyphenDate(birth);
  const isValid = digits.length === 8;

  const onBirthInput = (e) => setBirth(fmtYYYYMMDD(e.target.value));
  const onBirthKeyDown = (e) => {
    const ok = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ];
    if (ok.includes(e.key)) return;
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  };

  const submit = () => {
    if (!isValid || !name.trim()) return;
    const seedBirth = `${hyphen}|${calendarType}|${birthTime}`;
    const params = new URLSearchParams({ name: name.trim(), birth: seedBirth });
    nav(`/result?${params.toString()}`);
  };

  return (
    <section className="hero">
      <div className="row">
        {/* 좌측 히어로 */}
        <div>
          <span className="pill">
            <span className="dot" /> 오늘의 인사이트
          </span>
          <h1>
            AI 운세로{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, var(--accent-1), var(--accent-2))",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              하루의 방향
            </span>
            을 잡으세요
          </h1>
          <p className="subtle">
            이름과 생년월일만 입력하면 매일 고정된 시드로 재현 가능한 운세
            결과를 제공합니다. 중요한 결정 전, 간단히 체크하세요.
          </p>
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(3, minmax(0,1fr))",
              marginTop: 10,
            }}
          >
            <Badge label="연애운" />
            <Badge label="금전운" />
            <Badge label="학업운" />
          </div>
        </div>

        {/* 우측 폼 카드 */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>빠른 시작</h3>
          <div className="grid">
            <label>
              이름
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 거녕"
                autoFocus
              />
            </label>

            <label>
              생년월일
              <input
                value={birth}
                onChange={onBirthInput}
                onKeyDown={onBirthKeyDown}
                placeholder="YYYY.MM.DD"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </label>

            <div className="row-2">
              <label>
                양력/음력
                <div className="toggle">
                  <span
                    className={`opt ${
                      calendarType === "solar" ? "active" : ""
                    }`}
                    onClick={() => setCalendarType("solar")}
                  >
                    양력
                  </span>
                  <span
                    className={`opt ${
                      calendarType === "lunar" ? "active" : ""
                    }`}
                    onClick={() => setCalendarType("lunar")}
                  >
                    음력
                  </span>
                </div>
              </label>

              <label>
                태어난 시간
                <TimeSelect
                  value={birthTime}
                  onChange={(v) => setBirthTime(v)}
                />
              </label>
            </div>

            <button
              className="btn btn-primary"
              onClick={submit}
              disabled={!isValid || !name.trim()}
            >
              오늘의 운세 보기
            </button>
          </div>

          <p className="muted" style={{ marginTop: 12, fontSize: 12 }}>
            개인정보는 저장되지 않으며, 브라우저 내에서만 처리됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}

function Badge({ label }) {
  return (
    <div className="card" style={{ padding: "10px 12px" }}>
      <span style={{ fontWeight: 700 }}>{label}</span>
    </div>
  );
}
