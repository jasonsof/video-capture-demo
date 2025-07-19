type RecordButtonProps = {
  state: string
  onClick: () => void
}

function RecordButton({ state, onClick }: RecordButtonProps) {
  const stateClass = state === "recording"
    ? "record-button--recording"
    : "record-button--ready"

  return (
    <button
      className={`record-button ${stateClass}`}
      onClick={onClick}
    />
  )
}


export default RecordButton