import connectedToArrow from "../../../../assets/icons/topology-legend-connected-to.svg?raw";
import dependsOnArrow from "../../../../assets/icons/topology-legend-depends-on.svg?raw";
import styles from "./TopologyLegend.module.css";

function LegendArrow({ svg }: { svg: string }) {
  return (
    <span
      className={styles.legendArrow}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg.replace(/<\?xml[^>]*\?>/, "") }}
    />
  );
}

/** Edge legend — label then 48px arrow (`53993:290286`). */
export function TopologyLegend() {
  return (
    <div className={styles.legend} aria-label="Edge legend">
      <div className={styles.legendItem}>
        <span className={styles.legendLabel}>Connected To</span>
        <LegendArrow svg={connectedToArrow} />
      </div>
      <div className={styles.legendItem}>
        <span className={styles.legendLabel}>Depends On</span>
        <LegendArrow svg={dependsOnArrow} />
      </div>
    </div>
  );
}
