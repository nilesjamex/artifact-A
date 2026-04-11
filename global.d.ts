// interface INPEntry {
//   name: string;
//   duration: number;
//   interactionId: any;
// }

// interface INPReport {
//   durations: number[];
//   worst: number;
//   average: string;
//   count: number;
// }

// // Extend Window to avoid implicit `any` in page.evaluate()
// declare global {
//   interface Window {
//     __inpEntries?: INPEntry[];
//     __inpObserver?: PerformanceObserver;
//   }
// }
