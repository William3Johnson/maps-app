import { getPeriodNameFromId, getDimensionsFromFilters } from './analytics';
import { loadDataItemLegendSet } from './legend';
import { cleanDimension } from './favorites';
import { THEMATIC_LAYER } from '../constants/layers';

export const NAMESPACE = 'analytics';
export const CURRENT_AO_KEY = 'currentAnalyticalObject';

export const APP_URLS = {
    CHART: 'dhis-web-data-visualizer',
    PIVOT: 'dhis-web-pivot',
};

// Combines all dimensions in columns, rows and filters
const getDimensionsFromAnalyticalObject = ao => {
    const { columns = [], rows = [], filters = [] } = ao;
    return [...columns, ...rows, ...filters];
};

// Returns the data items of the first dx dimension in an analytical object
export const getDataDimensionsFromAnalyticalObject = ao => {
    const dims = getDimensionsFromAnalyticalObject(ao);
    const dataDim = dims.find(i => i.dimension === 'dx');

    // We only use the first dx dimension
    return dataDim ? dataDim.items : [];
};

// Returns true if analytical object contains a single data dimension item
export const hasSingleDataDimension = ao => {
    const dataItems = getDataDimensionsFromAnalyticalObject(ao);
    return dataItems.length === 1;
};

// Returns a thematic layer config from an analytical object
export const getThematicLayerFromAnalyticalObject = async (
    ao = {},
    dataId,
    isVisible = true
) => {
    const { yearlySeries, aggregationType = 'DEFAULT' } = ao;
    const dataDims = getDataDimensionsFromAnalyticalObject(ao);
    const dims = getDimensionsFromAnalyticalObject(ao);
    const orgUnits = dims.find(i => i.dimension === 'ou');
    const filters = getDimensionsFromFilters(dims); // Dynamic dimension filters
    let period = dims.find(i => i.dimension === 'pe');
    let dataDim = dataDims[0];

    if (dataId) {
        dataDim = dataDims.find(item => item.id === dataId);
    }

    if (!dataDim || !orgUnits || !period) {
        return;
    }

    // Load default legend set for selected data dimension
    const legendSet = await loadDataItemLegendSet(dataDim);

    // Currently we only support one period in map filters so we select the first
    if (yearlySeries && yearlySeries.length) {
        period = {
            dimension: 'pe',
            items: [
                {
                    id: yearlySeries[0],
                    name: getPeriodNameFromId(yearlySeries[0]),
                },
            ],
        };
    }

    return {
        layer: THEMATIC_LAYER,
        columns: [{ dimension: 'dx', items: [dataDim] }],
        rows: [orgUnits],
        filters: [period, ...filters],
        aggregationType,
        legendSet,
        isVisible,
        opacity: 0.9,
    };
};

// Translates a thematic layer to an analytical object
export const getAnalyticalObjectFromThematicLayer = (layer = {}) => {
    const {
        columns = [],
        rows = [],
        filters = [],
        aggregationType = 'DEFAULT',
    } = layer;

    return {
        columns,
        rows: rows.map(cleanDimension),
        filters,
        aggregationType,
    };
};

// Temporary fix until we switch to hash and react router
export const clearAnalyticalObjectFromUrl = () => {
    const [base, params] = window.location.href.split('?');

    if (params && history && history.pushState) {
        const leftParams = params
            .split('&')
            .filter(p => !p.includes('currentAnalyticalObject'));

        const url =
            base + (leftParams.length ? `?${leftParams.join('&')}` : '');

        history.pushState({}, null, url);
    }
};
