const Messages = ({ messages }) => (
  <>
    {messages.errors
      ? messages.errors.map((el, i) => (
          <div key={i} className="alert alert-danger">
            {el.msg}
          </div>
        ))
      : null}
      {messages.success
      ? messages.success.map((el, i) => (
          <div key={i} className="alert alert-success">
            {el.msg}
          </div>
        ))
      : null}
    {messages.info
      ? messages.info.map((el, i) => (
          <div key={i} className="alert alert-info">
            {el.msg}
          </div>
        ))
      : null}
  </>
);

export default Messages;
