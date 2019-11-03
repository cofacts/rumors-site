import { t, jt } from 'ttag';

function Stats() {
  const newMessageCount = (
    <div key="em" className="huge">
      250
    </div>
  );
  const userForwardingCount = (
    <div key="em" className="huge">
      210
    </div>
  );
  const editorCount = (
    <div key="em" className="huge">
      12
    </div>
  );
  const meetupFrequency = (
    <div key="em" className="huge">
      2
    </div>
  );
  const gathering = (
    <a key="link" href="https://cofacts.kktix.cc/">
      {/* we hold ~ */ t`a gathering of editors.`}
    </a>
  );

  return (
    <div className="row">
      <div className="col-6 col-md-3">
        {jt`About ${newMessageCount} new messages entering our database each week.`}
      </div>
      <div className="col-6 col-md-3">
        {jt`About ${userForwardingCount} people forwarding new messages to our database each week.`}
      </div>
      <div className="col-6 col-md-3">
        {jt`But less than ${editorCount} active editors can help us respond each week.`}
      </div>
      <div className="col-6 col-md-3">
        {jt`Every ${meetupFrequency} months we hold ${gathering}`}
      </div>
      <style jsx>{`
        .row :global(.huge) {
          font-size: 3em;
          font-weight: 900;
        }
      `}</style>
    </div>
  );
}

export default Stats;
