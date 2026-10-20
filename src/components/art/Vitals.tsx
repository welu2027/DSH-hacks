/* Two read-outs pinned to the hero scene: a heart-rate strip with a sweeping
   ECG, and an AI-triage confidence bar. Decorative only. */
const ECG = "M0 20h22l4-5 4 5h8l3-16 4 28 3-12h10l5-5 5 5h30l4-5 4 5h8l3-16 4 28 3-12h10l5-5 5 5h12";

export default function Vitals() {
  return (
    <>
      <div className="vital v-hr">
        <span className="v-k"><i className="v-dot" />Heart rate</span>
        <span className="v-n">72<small>bpm</small></span>
        <svg viewBox="0 0 160 36" className="v-ecg">
          <path d={ECG} className="v-ecg-base" />
          <path d={ECG} className="v-ecg-run" pathLength={100} />
        </svg>
      </div>
      <div className="vital v-ai">
        <span className="v-k"><i className="v-dot" />AI triage</span>
        <span className="v-bar"><i /></span>
        <span className="v-meta">confidence 0.94 · routed to care</span>
      </div>
    </>
  );
}
