/* global AFRAME */
import Simbol from 'simbol';

// Changes single quotes to double quotes from the HTML
function parseJSON(string) {
	string = string.replace(/'/g, '"');
	return JSON.parse(string);
}

AFRAME.registerComponent('simbol', {

	schema: {
		hand: {default: 'left'},
		virtualpersona: {default: '{}'},
		multivp: {default: '{}'}
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
				multiVP: parseJSON(this.data.multivp)
			};

			config.scene = {
				render: false,
				animate: false,
				sceneToLoad: this.el.sceneEl.object3D,
				// It needs to be the parent to be positioned properly
				// As Simbol is looking for direct children of the scene
				// & World-Local position issue
				camera: this.el.sceneEl.camera.parent,
				renderer: this.el.sceneEl.renderer
			};

			this.config = config;
			this.simbol = new Simbol(config);
			this.simbol.init();
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
		multivp: 'simbol.multivp'
	}
});
