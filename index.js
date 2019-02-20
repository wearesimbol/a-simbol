/* global AFRAME */
import Simbol from './node_modules/simbol/build/simbol.nothree.js';

// Changes single quotes to double quotes from the HTML
function parseJSON(string) {
	if (typeof string !== 'string') {
		return string
	}
	string = string.replace(/'/g, '"');
	return JSON.parse(string);
}

AFRAME.registerComponent('simbol', {

	schema: {
		hand: {default: 'left'},
		virtualpersona: {default: '{}'},
		interactions: {default: '{}'},
		multiuser: {default: '{}'}
	},

	init: function() {
		// Simbol handles controls itself
		window.addEventListener('load', () => {
			document.querySelector('[camera]').removeAttribute('wasd-controls');
			document.querySelector('[camera]').removeAttribute('look-controls');
			document.querySelector('.a-grab-cursor').classList.remove('a-grab-cursor');

			const config = {
				hand: this.data.hand,
				virtualPersona: parseJSON(this.data.virtualpersona),
				interactions: parseJSON(this.data.interactions),
				multiUser: parseJSON(this.data.multiuser)
			};

			config.scene = {
				render: false,
				animate: false,
				sceneToLoad: this.el.sceneEl.object3D,
				camera: this.el.sceneEl.camera,
				renderer: this.el.sceneEl.renderer
			};

			this.config = config;
			this.simbol = new Simbol(config);
			this.simbol.init().then(() => {
				this.el.sceneEl.emit('Simbol.loaded');
			});
		});
	},

	tick: function(time) {
		if (this.simbol) {
			for (const func of this.simbol._scene.animateFunctions) {
				func(time);
			}
		}
	}
});

AFRAME.registerPrimitive('a-simbol', {
	defaultComponents: {
		simbol: {}
	},

	mappings: {
		hand: 'simbol.hand',
		virtualpersona: 'simbol.virtualpersona',
		interactions: 'simbol.interactions',
		multiuser: 'simbol.multiuser'
	}
});

AFRAME.registerComponent('simbol-selectable', {
	init: function() {
		const simbolEl = document.querySelector('a-simbol');
		const simbolComponent = simbolEl.components.simbol;
		if (simbolComponent && simbolComponent.simbol) {
			this.addInteraction();
		} else {
			this.el.sceneEl.addEventListener('Simbol.loaded', () => {
				this.addInteraction();
			});
		}
		this._selectedHandler.bind(this);
		this._hoverHandler.bind(this);
		this._unselectedHandler.bind(this);
		this._unhoverHandler.bind(this);
		this.remove.bind(this);
	},

	addInteraction: function() {
		const simbolEl = document.querySelector('a-simbol');
		if (!simbolEl) {
			return;
		}
		this.simbol = simbolEl.components.simbol.simbol;
		if (!this.simbol.interactions) {
			return;
		}
		this.simbol.addInteraction({
			interaction: 'selection',
			mesh: this.el.object3D
		});

		this.el.object3D.on('selected', this._selectedHandler);
		this.el.object3D.on('hover', this._hoverHandler);
		this.el.object3D.on('unselected', this._unselectedHandler);
		this.el.object3D.on('unhover', this._unhoverHandler);
	},

	_selectedHandler: function() {
		this.el.emit('Simbol.selected');
	},

	_hoverHandler: function() {
		this.el.emit('Simbol.hover');
	},

	_unselectedHandler: function() {
		this.el.emit('Simbol.unselected');
	},

	_unhoverHandler: function() {
		this.el.emit('Simbol.unhover');
	},

	remove: function() {
		if (this.simbol && this.simbol.interactions) {
			this.simbol.interactions.selection.remove(this.el.object3D);
			this.el.object3D.off('selected', this._selectedHandler);
			this.el.object3D.off('hover', this._hoverHandler);
			this.el.object3D.off('unselected', this._unselectedHandler);
			this.el.object3D.off('unhover', this._unhoverHandler);
		}
	}
});

AFRAME.registerComponent('simbol-networked', {

	schema: {
		animatedvalues: {default: []}
	},

	init: function() {
		if (!this.el.id) {
			console.error(`Component ${this.el} needs an ID for 'simbol-networked'`);
			return;
		}
		this.el.object3D.name = this.el.id;
		const simbolEl = document.querySelector('a-simbol');
		const simbolComponent = simbolEl.components.simbol;
		if (simbolComponent && simbolComponent.simbol) {
			this.addNetworked();
		} else {
			this.el.sceneEl.addEventListener('Simbol.loaded', () => {
				this.addNetworked();
			});
		}
	},

	addNetworked: function() {
		const simbolEl = document.querySelector('a-simbol');
		if (!simbolEl) {
			return;
		}
		this.simbol = simbolEl.components.simbol.simbol;
		if (!this.simbol.multiUser) {
			return;
		}
		this.simbol.multiUser.addObject({
			type: 'name',
			value: this.el.object3D.name,
			id: this.el.id,
			owner: 'self',
			animatedValues: this.data.animatedvalues
		});
	},

	remove: function() {
		if (this.simbol && this.simbol.multiUser) {
			this.simbol.multiUser.removeObject(this.el.id);
		}
	}
});
