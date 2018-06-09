import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import Interpretations from '@dhis2/d2-ui-interpretations';
import queryString from 'query-string';
import { openInterpretationsPanel } from '../../actions/ui';
import { setRelativePeriodDate } from '../../actions/map';
import { setInterpretation } from '../../actions/interpretations';
import {
    HEADER_HEIGHT,
    INTERPRETATIONS_PANEL_WIDTH,
} from '../../constants/layout';

const style = {
    position: 'absolute',
    top: HEADER_HEIGHT,
    bottom: 0,
    height: 'auto',
    backgroundColor: '#fafafa',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 0.227451)',
    overflowX: 'hidden',
    overflowY: 'auto',
    zIndex: 1190,
};

// https://github.com/EyeSeeTea/d2-ui-playground/blob/feature/interpretations/src/Root.js
// http://localhost:8082/?id=zDP78aJU8nX&interpretationid=zS8iVkpyCVb
class InterpretationsPanel extends Component {
    static contextTypes = {
        d2: PropTypes.object,
    }

    componentWillMount() {
        const interpretationId = queryString.parse(location.search).interpretationid;

        if (interpretationId) {
            this.props.setInterpretation(interpretationId);
            this.props.openInterpretationsPanel();
        }
    }

    render() {
        const { mapId, isOpen, interpretationId } = this.props;

        if (!mapId) {
            return null;
        }

        return (
            <Drawer
                open={Boolean(isOpen && mapId)}
                openSecondary={true}
                containerStyle={style}
                width={INTERPRETATIONS_PANEL_WIDTH}
            >
                <Interpretations
                    d2={this.context.d2}
                    id={mapId}
                    type="map"
                    currentInterpretationId={interpretationId}
                    onCurrentInterpretationChange={this.onCurrentInterpretationChange}
                />
            </Drawer>
        )
    }

    onCurrentInterpretationChange = (interpretation) => {
        this.props.setInterpretation(interpretation ? interpretation.id : null);
        this.props.setRelativePeriodDate(interpretation ? interpretation.created : null);
    }
}

export default connect(
    state => ({
        isOpen: state.ui.interpretationsPanelOpen,
        mapId: state.map.id,
        interpretationId: state.interpretation.id,
    }),
    { openInterpretationsPanel, setInterpretation, setRelativePeriodDate }
)(InterpretationsPanel);