import { nanoid } from 'nanoid';

export const genId = ({
  prefix,
  length,
}: {
  prefix?: string;
  length?: number;
}): string => {
  const id = `${prefix || ''}${nanoid(length || 10)}`;
  return id;
};
