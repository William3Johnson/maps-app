import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import { connect } from 'react-redux';
import { Checkbox } from '../../core';
import { setEventStatus } from '../../../actions/layerEdit';
import { dimConf } from '../../../constants/dimension';
import {
    EVENT_STATUS_ALL,
    EVENT_STATUS_COMPLETED,
} from '../../../constants/eventStatuses';

const eventDataTypes = [
    dimConf.indicator.objectName,
    dimConf.programIndicator.objectName,
    dimConf.eventDataItem.objectName,
];

export const CompletedOnlyCheckbox = ({
    valueType,
    completedOnly,
    setEventStatus,
}) => {
    const hasEventData = eventDataTypes.includes(valueType);

    useEffect(() => {
        if (completedOnly && !hasEventData) {
            setEventStatus(EVENT_STATUS_ALL);
        }
    }, [completedOnly, hasEventData, setEventStatus]);

    return hasEventData ? (
        <Checkbox
            label={i18n.t('Only show completed events')}
            checked={completedOnly}
            onChange={isChecked =>
                setEventStatus(
                    isChecked ? EVENT_STATUS_COMPLETED : EVENT_STATUS_ALL
                )
            }
        />
    ) : null;
};

CompletedOnlyCheckbox.propTypes = {
    valueType: PropTypes.string,
    completedOnly: PropTypes.bool,
    setEventStatus: PropTypes.func.isRequired,
};

export default connect(
    ({ layerEdit }) => ({
        completedOnly: layerEdit.eventStatus === EVENT_STATUS_COMPLETED,
    }),
    { setEventStatus }
)(CompletedOnlyCheckbox);
