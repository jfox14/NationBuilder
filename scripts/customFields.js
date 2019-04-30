const e = React.createElement;

function CustomFields(props) {
  return (
    <div id="custom-fields-form">
      <label htmlFor="customFieldName">Name*</label>
      <input
        id="customFieldName"
        aria-describedby="Custom field name"
        aria-label="Custom field name"
        className={
          "form-control " + (props.name.status == "error" ? "is-invalid" : "")
        }
        type="text"
        value={props.name.text}
        onChange={props.name.onChange}
      />
      <label htmlFor="customFieldSlug">Slug*</label>
      <div className="block">
        <input
          id="customFielSlug"
          aria-describedby="Custom field slug"
          aria-label="Custom field slug"
          className={
            "form-control " + (props.slug.status == "error" ? "is-invalid" : "")
          }
          disabled={props.editMode ? "disabled" : ""}
          type="text"
          value={props.slug.text}
          onChange={props.slug.onChange}
        />
        <span className="helper-text">
          Choose carefully, for data integrity reasons, this cannot be changed
          later.
        </span>
      </div>

      <label htmlFor="customFieldType">Field type*</label>
      <div
        className={
          "select-style " + (props.type.status == "error" ? "is-invalid" : "")
        }
      >
        <select
          id="customFieldType"
          aria-describedby="Custom field type"
          aria-label="Custom field type"
          value={props.type.value}
          onChange={props.type.onChange}
        >
          <option key="-1">Select option</option>
          <option key="Text">Text</option>
          <option key="Checkbox">Checkbox</option>
          <option key="Multiple choice">Multiple choice</option>
        </select>
      </div>

      {props.editMode ? (
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!props.formReadyToSubmit}
          onClick={props.handleSave}
        >
          Save edit
        </button>
      ) : (
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!props.formReadyToSubmit}
          onClick={props.handleSubmit}
        >
          Create field
        </button>
      )}
      <div className="table-container-responsive">
      <table className="table table-hover" id="custom-fields-table">
        <thead>
          <tr>
            <th style={{ width: "10%" }} scope="col" />
            <th scope="col" style={{ width: "25%" }}>
              Name
            </th>
            <th scope="col" style={{ width: "25%" }}>
              Slug
            </th>
            <th scope="col" style={{ width: "25%" }}>
              Type
            </th>
            <th scope="col" style={{ width: "15%" }} />
          </tr>
        </thead>
        <tbody>
          {props.customFields.map((customField, i) => (
            <tr key={"key_" + customField.id}>
              <td scope="row">
                <a
                  className="edit-link"
                  onClick={e => props.handleEdit(e, customField.id)}
                >
                  Edit
                </a>
              </td>
              <td>{customField.name.text}</td>
              <td>{customField.slug.text}</td>
              <th>{customField.type.value}</th>
              <td>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle inline-button-dropdown"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  />
                  <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={e => props.handleDelete(e, i)}
                    >
                      Delete
                    </a>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

//presentational component handeling only JSX rendering
CustomFields.propTypes = {};

//container component with state handlers, validation, and CRUD logic
function withCustomFieldsStateAndHandlers(ComponentToWrap) {
  class CustomFieldsContainer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        slug: { text: "", status: null },
        name: { text: "", status: null },
        type: { value: "-1", status: null },
        customFields: [],
        customFieldToEdit: null,
        editMode: false
      };

      // all callbacks need to be bound
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.handleEdit = this.handleEdit.bind(this);
      this.handleSave = this.handleSave.bind(this);
      this.onSlugChange = this.onSlugChange.bind(this);
      this.onNameChange = this.onNameChange.bind(this);
      this.onTypeChange = this.onTypeChange.bind(this);
      this.submitNewCustomField = this.submitNewCustomField.bind(this);
    }

    handleSubmit = e => {
      e.preventDefault();
      this.submitNewCustomField();
    };

    handleSave = e => {
      e.preventDefault();
      this.saveCustomField();
    };

    handleDelete = (e, index) => {
      this.deleteCustomField(index);
    };

    handleEdit = (e, id) => {
      this.editCustomField(id);
    };

    deleteCustomField = index => {
      let customFieldsCopy = this.state.customFields;
      customFieldsCopy.splice(index, 1);

      this.setState({
        customFields: customFieldsCopy
      });
    };

    editCustomField = id => {
      let customFieldsCopy = this.state.customFields;
      let customFieldToEdit = customFieldsCopy.find(p => p.id === id);

      this.setState({
        name: customFieldToEdit.name,
        slug: customFieldToEdit.slug,
        type: customFieldToEdit.type,
        editMode: true,
        customFieldToEdit: id
      });
    };

    saveCustomField() {
      let updatedCustomFieldSlug = this.state.slug;
      let updatedCustomFieldName = this.state.name;
      let updatedCustomFieldType = this.state.type;
      let customFieldsCopy = this.state.customFields;

      let updatedCustomFieldValues = {
        id: this.state.customFieldToEdit,
        name: updatedCustomFieldName,
        slug: updatedCustomFieldSlug,
        type: updatedCustomFieldType
      };

      const index = customFieldsCopy.findIndex(
        p => p.id === this.state.customFieldToEdit
      );

      if (index !== -1) {
        customFieldsCopy[index] = updatedCustomFieldValues;
      }

      this.setState({
        customFields: customFieldsCopy,
        slug: { text: "", status: null },
        name: { text: "", status: null },
        type: { value: "-1", status: null },
        editMode: false,
        customFieldToEdit: ""
      });
    }

    submitNewCustomField() {
      let newCustomFieldSlug = this.state.slug;
      let newCustomFieldName = this.state.name;
      let newCustomFieldType = this.state.type;

      let customFieldsCopy = this.state.customFields;
      customFieldsCopy.push({
        id:
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15),
        name: newCustomFieldName,
        slug: newCustomFieldSlug,
        type: newCustomFieldType
      });

      this.setState({
        customFields: customFieldsCopy,
        slug: { text: "", status: null },
        name: { text: "", status: null },
        type: { value: "-1", status: "error" }
      });
    }

    onSlugChange = e => {
      var re = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
      var isMatch = re.test(e.target.value);
      var status = isMatch ? "success" : "error";

      this.setState({
        slug: {
          ...this.state.slug,
          status: status,
          text: e.target.value
        }
      });
    };

    onNameChange = e => {
      var re = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
      var isMatch = re.test(e.target.value);
      var status = isMatch ? "success" : "error";

      this.setState({
        name: {
          ...this.state.name,
          status: status,
          text: e.target.value
        }
      });
    };

    onTypeChange = e => {
      var status = e.target.value != "Select option" ? "success" : "error";
      this.setState({
        type: {
          ...this.state.type,
          status: status,
          value: e.target.value
        }
      });
    };

    render() {
      const slug = {
        onChange: this.onSlugChange,
        status: this.state.slug.status,
        text: this.state.slug.text
      };

      const name = {
        onChange: this.onNameChange,
        status: this.state.name.status,
        text: this.state.name.text
      };

      const type = {
        onChange: this.onTypeChange,
        status: this.state.type.status,
        value: this.state.type.value
      };

      const noErrors =
        slug.status === "success" &&
        name.status === "success" &&
        type.status === "success";
      const customFields = this.state.customFields;
      const customFieldToEdit = this.state.customFieldToEdit;
      const editMode = this.state.editMode;

      //inject handlers and crud functionality references into the presentational
      //component
      return (
        <ComponentToWrap
          customFields={customFields}
          handleSubmit={this.handleSubmit}
          handleDelete={this.handleDelete}
          handleEdit={this.handleEdit}
          handleSave={this.handleSave}
          customFieldToEdit={this.customFieldToEdit}
          editMode={editMode}
          slug={slug}
          name={name}
          type={type}
          formReadyToSubmit={noErrors}
        />
      );
    }
  }

  return CustomFieldsContainer;
}

const domContainer = document.querySelector("#react-app");
ReactDOM.render(
  e(withCustomFieldsStateAndHandlers(CustomFields)),
  domContainer
);
