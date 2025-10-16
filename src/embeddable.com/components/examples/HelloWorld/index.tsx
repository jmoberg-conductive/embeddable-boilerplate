/*
 * This file just displays a simple title and body.
 * Its props are passed from the .emb.ts file
 *
 * You can delete this folder once you move to Vanilla Components post-Onboarding
 */
import React from 'react';

type Props = {
  title: string;
  body: string;
  body2: string;
};

export default (props: Props) => {
  return (
    <div className="basic-text-component">
      <h1>{props.title}</h1>
      <p>{props.body}</p>
      <p>{props.body2}</p>
    </div>
  );
};
