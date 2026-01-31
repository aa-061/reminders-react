import "./ModesTable.css";
import { modeStore, modesStore } from "../../store";

export default ({
  addNewMode,
}: {
  addNewMode: ({ mode, address }: { mode: string; address: string }) => void;
}) => {
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: TModeField,
  ) {
    const newFormState = { ...modeStore.state };
    newFormState[field] = e.target.value as never;
    modeStore.setState(newFormState);
  }

  function handleForm(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    addNewMode({
      mode: modeStore.state.mode,
      address: modeStore.state.address,
    });
  }

  console.log("ModesTable modeStore = ", modeStore.state);

  return (
    <div
      className="ModesTable"
      style={{ border: "2px solid green", padding: "10px", margin: "10px" }}
    >
      <table>
        <thead>
          <tr>
            <th>Mode</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {modesStore.state.map((mode, i) => {
            return (
              <tr key={i}>
                <td>{mode.mode}</td>
                <td>{mode.address}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
