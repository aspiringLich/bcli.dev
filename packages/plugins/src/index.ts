import type { Processor, Transformer } from 'unified';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';
import { toHtml } from 'hast-util-to-html';
import { toHast } from 'mdast-util-to-hast';
import { toString as mdastToString } from 'mdast-util-to-string';
import type { Heading } from 'mdast';
import type { VFile } from 'vfile';
import GithubSlugger from 'github-slugger';

declare module 'mdast' {
	interface HeadingData {
		id?: string;
	}
}

declare module 'unist' {
	interface Data {
		id?: string;
	}
}

export type OutlineItem = { id: string; html: string; depth: number };

/**
 * **remark**: generate an outline of the document based on headings, put data in frontmatter.
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
		const outline: OutlineItem[] = [];
		const slugger = new GithubSlugger();

		visit(
			tree,
			'heading',
			(node: Heading) => {
				const id = slugger.slug(mdastToString(node));

				if (headings.includes(node.depth)) {
					let html = toHtml(toHast(node));
					html = /<[^>]+>(.*?)<\/[^>]+>/.exec(html)?.[1] || html;
					node.data = node.data ?? {};
					node.data.hProperties = { id };
					outline.push({ id, html, depth: node.depth });
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
