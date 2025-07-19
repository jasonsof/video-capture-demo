type RecordButtonProps = {
  state: string
  onClick: () => void
}

function RecordButton({ state, onClick }: RecordButtonProps) {
  console.log("state =", state)

  let stateClass;
  switch(state) {
    case "recording":
      stateClass = "record-button--recording";
      break;
    case "ready":
      stateClass = "record-button--ready";
      break;
    case "notready":
      stateClass = "record-button--error";
      break;
  }

  const handleClick = () => {
    if(state === "notready") return

    onClick()
  }

  return (
    <button
      className={`record-button ${stateClass}`}
      onClick={handleClick}
    />
  )
}


export default RecordButton