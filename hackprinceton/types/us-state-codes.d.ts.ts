declare module 'us-state-codes' {
  interface USStateCodes {
    getStateCodeByStateName(name: string): string | null;
    getStateNameByStateCode(code: string): string | null;
  }

  const usStateCodes: USStateCodes;
  export default usStateCodes;
}
