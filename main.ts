import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { Tiktoken, getEncoding } from "js-tiktoken";


export default class TiktokenPlugin extends Plugin {
	statusBar: HTMLElement;
	contentLength: number;
	enc: Tiktoken;

	async onload() {

		this.contentLength = 0;

		this.enc = getEncoding("gpt2");

		this.statusBar = this.addStatusBarItem();
		this.statusBar.setText('');

		this.updateStatusBar();

		this.registerInterval(
			window.setInterval(() => this.updateStatusBar(), 2000)
		);
	}

	updateStatusBar() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (view != null) {
			if (view.editor.getSelection().length > 0) {
				if (view.editor.getSelection().length != this.contentLength) {
					this.contentLength = view.editor.getSelection().length;
					this.statusBar.setText(this.enc.encode(view.editor.getSelection()).length + ' tiktokens (in selection)');
				}
			}
			else if (this.contentLength != view.editor.getValue().length) {
				this.contentLength = view.editor.getValue().length;
				this.statusBar.setText(this.enc.encode(view.editor.getValue()).length + ' tiktokens');
			}
		}
	}
}
