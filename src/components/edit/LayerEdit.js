import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import i18next from 'i18next';
import Button from 'd2-ui/lib/button/Button';
import EventDialog from './EventDialog';
import FacilityDialog from './FacilityDialog';
import ThematicDialog from './thematic/ThematicDialog';
import BoundaryDialog from './BoundaryDialog';
import EarthEngineDialog from './EarthEngineDialog';
import { loadLayer, cancelLayer } from '../../actions/layers';

const layerType = {
    event: EventDialog,
    facility: FacilityDialog,
    thematic: ThematicDialog,
    boundary: BoundaryDialog,
    earthEngine: EarthEngineDialog,
};

// Only create one widget per layer (will be changed when we switch to react)
const widgets = {};
const editCounter = {};

let nextOverlayId = 0;

const styles = {
    body: {
        padding: 0,
        minHeight: 300,
    },
    title: {
        padding: '8px 16px',
        fontSize: 18,
    },
};

class LayerEdit extends Component {

    componentDidUpdate(prevProps) {
        const { layer, loadLayer } = this.props;

        if (layer) {
            const config = { ...layer };
            let id = config.id;

            if (!id) { // New layer
                id = 'layer-' + nextOverlayId++;
                config.id = id;
                config.isNew = true;
            } else {
                config.isNew = false;
            }

            if (config.layer === 'external') { // External layers has no edit widget
                config.editCounter = 1;
                loadLayer(config);
            }
        }

    }

    addLayer() {
        const { layer, loadLayer } = this.props;

        const config = {
            ...layer,
            id: 'layer-' + nextOverlayId++,
            isLoaded: false,
        };

        console.log('Add layer');

        loadLayer(config);
        this.closeDialog();
    }

    updateLayer() {
        const { layer, loadLayer } = this.props;

        loadLayer({
            ...layer,
            isLoaded: false,
        });

        console.log('Update layer');

        this.closeDialog();
    }

    closeDialog() {
        this.props.cancelLayer();
    }

    onLayerChange(config) {
        this.config = config;
    }

    render() {
        const { layer, loadLayer, cancelLayer } = this.props;

        if (!layer) {
            return null;
        }

        // console.log('render', layer);

        const LayerDialog = layerType[layer.layer];

        if (!LayerDialog) {
            return null;
            // reject('Unknown layer type.'); // TODO
        }

        // console.log('add or update', config.id, (config.id ? 'Update' : 'Add'));

        return (
            <Dialog
                title={layer.title} // TODO: i18n
                bodyStyle={styles.body}
                titleStyle={styles.title}
                open={true}
                actions={[
                    <Button
                        color='primary'
                        onClick={() => cancelLayer()}
                        selector='cancel'
                    >{i18next.t('Cancel')}</Button>,
                    <Button
                        color='primary'
                        onClick={() => loadLayer(this.props.layer)}
                        selector='update'
                    >{i18next.t('Update layer')}</Button>
                ]}

            >
                <LayerDialog {...layer} />
            </Dialog>
        );
    }
}

export default connect(
    (state) => ({
        layer: state.layerEdit,
    }),
    { loadLayer, cancelLayer }
)(LayerEdit);

/*
>{i18next.t('Cancel')}</Button>,
(config.id ?
<Button
  color='primary'
  onClick={() => this.updateLayer()}
  selector='update'
>{i18next.t('Update layer')}</Button>
:
<Button
  color='primary'
  onClick={() => this.addLayer()}
  selector='add'
>{i18next.t('Add layer')}</Button>
)
  */