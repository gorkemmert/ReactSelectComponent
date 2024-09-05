import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './CustomSelect.css'

export default function CustomSelect(props) {
  const { options, onChange, displayValue, keyValue, sortable, placeholder, value, displatMethod, disabled, isFilter, isMultipleSelect } = props;

  const [itemList, setItemList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [defaultPlaceHolder, setDefaultPlaceHolder] = useState(placeholder ? placeholder : '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState(isMultipleSelect ? [] : value ? [value] : null);
  const selectRef = useRef(null);

  useEffect(()=>{
    if(isMultipleSelect){
      setSelectedItems([])
    }
  },[isMultipleSelect])

  useEffect(()=>{
    if(isFilter){
      setDefaultPlaceHolder('Search')
    }
  },[isFilter])

  
  useEffect(() => {
    let updatedOptions = [...options];

    if (sortable) {
      updatedOptions.sort((a, b) => a[displayValue].localeCompare(b[displayValue]));
    }

    setItemList(updatedOptions)
  }, [options,sortable]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectHeaderClick = () => {
    if(!disabled){
      if (isFilter) {
        setIsOpen(true);
      }else {
        setIsOpen(!isOpen)
      }
    }   
  };

  const handleOptionClick = (option) => {
    if (option.disabled) return;
    if(isMultipleSelect){
      let newSelectedItems = [...selectedItems]
      if(newSelectedItems.includes(option[keyValue])){
        newSelectedItems = newSelectedItems.filter(item => item !== option[keyValue]);
      } else {
        newSelectedItems.push(option[keyValue]);
      } 
      setSelectedItems(newSelectedItems);
      onChange(newSelectedItems);
    } else {
      setSelectedItems(option[keyValue]);
      onChange(option[keyValue]);
      setSearchTerm(option[displayValue]);
    }
    
    // onChange(option[keyValue]);
    // if(!isFilter){
    //   setIsOpen(false);
    // }
  };

  const getSelectedDisplay = () => {
    if (isMultipleSelect && Array.isArray(selectedItems)) {
      const selectedOptions = options?.filter(option => selectedItems?.includes(option[keyValue])) ;
      if(selectedOptions.length>0){
        return (
          <div className="selectedCards">
            {selectedOptions.map(option => (
              <div className='selectedCard' key={option[keyValue]}>
                <span>{`${option[displayValue]}`}</span>
                <button 
                  className='removeButton'
                  onClick={(e) => {
                    e.stopPropagation(); // Kaldır düğmesine tıklandığında açılır menünün kapanmasını önler
                    handleRemove(option[keyValue]);
                  }}
                >
                  <img alt="chevron-down" src={require('./icons/close.svg').default} />
                </button>
              </div>
            ))}
          </div>
        )
      }else {
        return defaultPlaceHolder
      }
      // return selectedOptions.map(option => option[displayValue]).join(', ') || placeholder;
    } else {
        return selectedItems ? options?.find(option => option[keyValue] === selectedItems)?.[displayValue] || defaultPlaceHolder : defaultPlaceHolder;
    }
  };

  const handleRemove = (id) => {
    const updatedSelectedItems = selectedItems.filter(item => item !== id);
    setSelectedItems(updatedSelectedItems);
    onChange(updatedSelectedItems);
  };

  const getSelectedDisplaywithFilter = () => {
    if (Array.isArray(selectedItems)) {
      const selectedOptions = options?.filter(option => selectedItems?.includes(option[keyValue])) ;
      
        return (
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <img alt="search" src={require('./icons/search.svg').default} />
            <div className="selectedCards">
            {selectedOptions.map(option => (
              <div className='selectedCard' key={option[keyValue]}>
                {displatMethod === 'userAvatar' && (
                  <img alt="defaultUser" src={require('./icons/avatar.svg').default} />
                )}
                <span>{`${option[displayValue]}`}</span>
                <button 
                  className='removeButton'
                  onClick={(e) => {
                    e.stopPropagation(); // Kaldır düğmesine tıklandığında açılır menünün kapanmasını önler
                    handleRemove(option[keyValue]);
                  }}
                >
                  <img alt="chevron-down" src={require('./icons/close.svg').default} />
                </button>
              </div>
            ))}
            <div style={{display: 'flex', width:'100px'}}>
              <input
                type="text"
                placeholder='Search'            
                className="searchMultipleInput"
                value={searchTerm}
                onChange={(e) => {
                  const newSearchTerm = e.target.value;
                  setSearchTerm(newSearchTerm);
                  const filtered = options.filter(option =>
                    option[displayValue].toLowerCase().includes(newSearchTerm.toLowerCase())
                  );
                  setItemList(filtered);
                }}
                />
              </div>
            </div>
            
          </div>       
        )
      
      // return selectedOptions.map(option => option[displayValue]).join(', ') || placeholder;
    } else {
        return selectedItems ? options?.find(option => option[keyValue] === selectedItems)?.[displayValue] || defaultPlaceHolder : defaultPlaceHolder;
    }
  };

  return (
    <div className={classNames("selectContainer",{["disabled"]: disabled})} ref={selectRef}>
      {isFilter ? (
        <div className='header'>
          Search
        </div>
      ) : (
        <div className='header'>
          Team member
        </div>
      )}  
      <div
        
        className="selectHeader"
        tabIndex={0}  // tabIndex ekleyerek focus olmasını sağlıyoruz.
        onClick={handleSelectHeaderClick}

      >

        {isFilter && !isMultipleSelect && (
          <>
            <div>
              <img alt="defaultUser" src={require('./icons/search.svg').default} />
            </div>
            <input
              type="text"
              placeholder='Search'            
              className="searchInput"
              value={searchTerm}
              onChange={(e) => {
                const newSearchTerm = e.target.value;
                setSearchTerm(newSearchTerm);
                const filtered = options.filter(option =>
                  option[displayValue].toLowerCase().includes(newSearchTerm.toLowerCase())
                );
                setItemList(filtered);
              }}
            />
          </>
        )}
        {!isFilter  && (
          <>
          <div className='selectLeft'>
            {displatMethod === 'avatar' && (
              <div>
              <img alt="defaultUser" src={require('./icons/defaultUser.svg').default} />
              </div>
            )}
            {displatMethod === 'dot' && (
              <div>
              <img alt="dot" src={require('./icons/dot.svg').default} />
              </div>
            )}
            <div className={classNames("selectLabel",{["selectLabelFull"]: value})}>
              {getSelectedDisplay()}
            </div>
          </div>
          <div className='selectRight'>
            <img alt="chevron-down" src={require('./icons/chevron-down.svg').default} />
          </div>
          </>
        )}
        
        {isFilter && isMultipleSelect && (
           <>
            
            {getSelectedDisplaywithFilter()}
          </>
        )}
      </div>
      {!isOpen && (
        <div className='altText'>
        This is a hint text to help user.
        </div>
      )}
      {isOpen && (
        <div className='selectBody'>
          <ul className='optionsList'>
            {itemList.map(option => (
              <li 
                className='optionItemContainer'
                key={option.id}
                onClick={() => handleOptionClick(option)}
              >
                <div className='optionItemBox'>
                  <div className='leftBody'>
                    {displatMethod === 'userAvatar' && (
                      <div>
                        <img alt="defaultUser" src={require('./icons/avatar.svg').default} />
                      </div>
                    )}
                    {displatMethod === 'avatar' && (
                      <div>
                        <img alt="defaultUser" src={require('./icons/defaultUser.svg').default} />
                      </div>
                    )}
                    {displatMethod === 'dot' && (
                      <div>
                        <img alt="dot" src={require('./icons/dot.svg').default} />
                      </div>
                    )}
                    <div className='itemText'>
                      {option[displayValue]}
                    </div>
                  </div>
                  {Array.isArray(value) && value.includes(option[keyValue]) && (
                      <div className='rightBody'>
                        <img alt="check" src={require('./icons/check.svg').default} />
                      </div> 
                  )}
                  {option[keyValue] === value && (
                    <div className='rightBody'>
                      <img alt="check" src={require('./icons/check.svg').default} />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

CustomSelect.defaultProps ={
    options: [],
    sortable: false,
    placeholder: "",
    displatMethod: "",
    disabled: false,
    isMultipleSelect: false
};

CustomSelect.propTypes = {
    options: PropTypes.array,
    sortable: PropTypes.bool,
    placeholder: PropTypes.string,
    displatMethod: PropTypes.string,
    disabled:PropTypes.bool,
    isFilter: PropTypes.bool,
    isMultipleSelect: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    displayValue: PropTypes.string.isRequired,
    keyValue: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
};
