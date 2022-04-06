export const resultsContainer = {
  listStyleType: 'none',
  margin: 0,
  padding: '0 0px 0px 0px',
  overflowY: 'auto',
};

export const resultStyle = `
.result {
  padding: .5rem 1rem;
  border-top: 1px solid #0D0D0D;
  background: #F7F7F7;
  cursor: pointer;
  color: ##0D0D0D;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result:last-child {
  border-bottom: 1px solid #0D0D0D;
}
`;

export const cancelBtnStyles = {
  display: 'flex',
  justifyContent: 'center',
  padding: '1.5rem',
  background: 'black',
  border: '0px',
};

export const searchStyles = {
  display: 'flex',
  justifyContent: 'center',
  padding: '10px 10px 0 10px',
  backgroundColor: 'white',
};

export const staticSearchStyles = {
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '#FFFFFF',
  alignItems: 'center',
};

export const staticStyles = {
  borderStyle: 'solid',
  borderImage: 'initial',
  borderWidth: 1,
  borderColor: '#afafaf',
  borderRightWidth: 1,
  borderTopLeftRadius: 3,
  borderBottomLeftRadius: 3,
  outline: 0,
  background: 'white',
  width: '100%',
  padding: '15px 5px 15px 5px',
  border: '1px solid #afafaf',
};

export const inputStyles = {
  borderStyle: 'solid',
  borderImage: 'initial',
  borderWidth: 1,
  borderColor: '#afafaf',
  borderRightWidth: 1,
  outline: 0,
  background: '#FFFFFF',
  width: '100%',
  padding: '15px 5px 15px 5px',
  borderBottom: '1px solid black',
  borderTopLeftRadius: '0',
  borderBottomLeftRadius: '0',
  fontSize: '1rem',
  border: 'none',
};

export const resultTextStyles = {
  fontWeight: '400',
};

export const searchButtonStyles = {
  borderStyle: 'solid',
  borderImage: 'initial',
  borderWidth: 1,
  borderColor: '#afafaf',
  borderLeftWidth: 0,
  borderTopRightRadius: 3,
  borderBottomRightRadius: 3,
  outline: 0,
  background: 'white',
  width: 50,
};
