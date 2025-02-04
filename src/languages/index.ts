import commonJson from './common.json';
import setupJson from './setup.json';
import stakeJson from './stake.json';
import mainJson from './main.json';

function mergeI18nData(i18nData: Record<string, any>[]) {
  const mergedI18nData: Record<string, any> = {};
  for (let i = 0; i < i18nData.length; i++) {
    const i18nItem = i18nData[i];
    for (const key in i18nItem) {
      mergedI18nData[key] = { ...(mergedI18nData[key] || {}), ...(i18nItem[key] || {}) };
    }
  }
  return mergedI18nData;
}

export {
  commonJson,
  setupJson,
  stakeJson,
  mainJson,
  mergeI18nData
}