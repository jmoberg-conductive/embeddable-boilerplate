/*
 * This file controls what inputs show up when you edit the component in the
 * Embeddable.com builder.
 *
 * You can delete this folder once you move to Vanilla Components post-Onboarding
 */
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';
import { Inputs } from '@embeddable.com/react';

export const meta = {
  name: 'HelloWorld',
  label: 'Hello World',
  defaultHeight: 100,
  defaultWidth: 400,
  category: 'Examples',
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart',
    },
    {
      name: 'body',
      type: 'string',
      label: 'Body',
      description: 'The text content',
    },
    {
      name: 'body2',
      type: 'string',
      label: 'Body2',
      description: 'The text content 2',
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      title: inputs.title,
      body: inputs.body,
      body2: inputs.body2,
    };
  },
});
