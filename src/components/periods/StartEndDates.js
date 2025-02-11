import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { DatePicker } from '../core';
import { setStartDate, setEndDate } from '../../actions/layerEdit';
import { DEFAULT_START_DATE, DEFAULT_END_DATE } from '../../constants/layers';
import styles from '../edit/styles/LayerDialog.module.css';

const StartEndDates = props => {
    const {
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        errorText,
        className,
    } = props;
    const hasDate = startDate !== undefined && endDate !== undefined;

    useEffect(() => {
        if (!hasDate) {
            setStartDate(DEFAULT_START_DATE);
            setEndDate(DEFAULT_END_DATE);
        }
    }, [hasDate, setStartDate, setEndDate]);

    return hasDate ? (
        <Fragment>
            <DatePicker
                label={i18n.t('Start date')}
                defaultVal={startDate}
                onBlur={setStartDate}
                className={className || styles.select}
            />
            <DatePicker
                label={i18n.t('End date')}
                defaultVal={endDate}
                onBlur={setEndDate}
                className={className || styles.select}
            />
            {errorText && (
                <div key="error" className={styles.error}>
                    {errorText}
                </div>
            )}
        </Fragment>
    ) : null;
};

StartEndDates.propTypes = {
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    errorText: PropTypes.string,
    setStartDate: PropTypes.func.isRequired,
    setEndDate: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default connect(null, { setStartDate, setEndDate })(StartEndDates);
