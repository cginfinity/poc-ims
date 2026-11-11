interface StatusViewProps {
  text: string;
  tone?: 'neutral' | 'error';
}

export function StatusView({ text, tone = 'neutral' }: StatusViewProps): JSX.Element {
  return <p className={tone === 'error' ? 'status status-error' : 'status'}>{text}</p>;
}
