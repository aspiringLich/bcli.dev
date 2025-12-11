import type { Processor, Transformer } from 'unified';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { toHtml } from 'hast-util-to-html';
import { toHast } from 'mdast-util-to-hast';
import { toString } from 'mdast-util-to-string';
import type { Heading, Root } from 'mdast';
import type { VFile } from 'vfile';
import GithubSlugger from 'github-slugger';

declare module 'mdast' {
	interface HeadingData {
		id?: string;
	}
}

export type OutlineItem = OutlineItem[] | { id: string; html: string };

/**
 * Calculates the reading time of your markdown files
 * @param {string} [options.attribute="outline"] - The attribute name in the file metadata to store the reading time (default is "outline")
 * @param {number[]} [options.headings=[2, 3]] - the heading levels to include (default [2, 3])
 */
export function outline(options = {}): Transformer {
	const defaultOptions = {
		attribute: 'outline',
		headings: [2, 3]
	};
	const { attribute, headings } = { ...defaultOptions, ...options };
	return (tree: Node, file: VFile) => {
		const outline: OutlineItem = [];
		const slugger = new GithubSlugger();

		visit(
			tree,
			'heading',
			(node: Heading) => {
				const slug = slugger.slug(toString(node));

				if (headings.includes(node.depth)) {
					const html = toHtml(toHast(node.children as any));
					let id;
					// ensure heading has an id
					if (node.data && node.data.id) {
						id = node.data.id;
					} else {
						node.data = node.data || {};
						node.data.id = slug;
						id = slug;
					}
					outline.push({ id, html });
				}
			},
			false
		);

		if (!file.data.fm) {
			file.data.fm = {};
		}
		(file.data.fm as any)[attribute] = outline;
	};
}
