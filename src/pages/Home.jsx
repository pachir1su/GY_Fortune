import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFortuneStore } from "../store/useFortuneStore.js";
import TimeSelect from "../components/TimeSelect.jsx";
import { fmtDot, toHyphen, parseDigits } from "../utils/date.js";

function Badge({ label }) {
  return (
    <div className="card" style={{ padding: "10px 12px" }}>
      <span style={{ fontWeight: 700 }}>{label}</span>
    </div>
  );
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

  const [err, setErr] = useState("");
  const digits = (birth || "").replace(/\D+/g, "");
  const hyphen = toHyphen(birth);
  const isValid = (() => {
    const p = parseDigits(birth);
    return p && p.ok;
  })();

  const onBirthInput = (e) => {
    const v = fmtDot(e.target.value);
    setBirth(v);
    const p = parseDigits(v);
    setErr(!p ? "" : p.ok ? "" : "존재하지 않는 날짜입니다.");
  };
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
    if (!isValid || !name.trim()) {
      setErr("생년월일을 정확히 입력해주세요.");
      return;
    }
    const seedBirth = `${hyphen}|${calendarType}|${birthTime}`;
    const params = new URLSearchParams({ name: name.trim(), birth: seedBirth });
    nav(`/result?${params.toString()}`);
  };

  return (
    <>
      <section className="hero">
        <div className="row">
          {/* 좌측 히어로 */}
          <div>
            <span className="pill">
              <span className="dot" /> 오늘의 인사이트
            </span>
            <h1>AI 운세로 하루의 방향을 잡으세요</h1>
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
                  className={err ? "input-error" : ""}
                />
                {err && (
                  <p
                    className="muted"
                    style={{ color: "#fda4af", marginTop: 6 }}
                  >
                    {err}
                  </p>
                )}
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

      {/* 최근 조회 섹션 */}
      <section className="hero" style={{ marginTop: 20 }}>
        <Recent />
      </section>
    </>
  );
}

/* 홈 하단: 최근 조회 */
function Recent() {
  const [list, setList] = useState([]);
  useEffect(() => {
    try {
      setList(
        JSON.parse(localStorage.getItem("gy_fortune_history_v1") || "[]")
      );
    } catch {
      setList([]);
    }
  }, []);
  if (!list.length) return null;
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>최근 조회</h3>
      <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {list.map((it) => {
          const qs = new URLSearchParams({
            name: it.name,
            birth: `${it.birth}|${it.cal}|${it.time}`,
          }).toString();
          return (
            <a
              key={it.hash}
              href={`/result?${qs}`}
              className="card"
              style={{ padding: 12, textDecoration: "none", color: "inherit" }}
            >
              <div style={{ fontWeight: 700 }}>{it.name}</div>
              <div className="muted small">
                {it.birth} · {it.cal === "lunar" ? "음력" : "양력"} ·{" "}
                {it.summary}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
