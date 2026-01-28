import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

export function CustomDropdown({
    options,
    value,
    onChange,
    placeholder,
    className = '',
    disabled = false,
    isEditable = false,
    onTextChange = () => { }
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const selectedOption = options.find(opt => opt.id === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus input when selection becomes editable
    useEffect(() => {
        if (isEditable && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditable]);

    const handleToggle = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
    };

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    const handleInputClick = (e) => {
        // Prevent toggling when clicking the input
        e.stopPropagation();
        if (!isOpen) setIsOpen(true);
    };

    return (
        <div className={`custom-dropdown ${className} ${isOpen ? 'is-open' : ''} ${disabled ? 'disabled' : ''}`} ref={dropdownRef}>
            <div className={`dropdown-trigger ${isEditable ? 'editable' : ''}`} onClick={handleToggle}>
                <span className="selected-value">
                    {isEditable ? (
                        <input
                            ref={inputRef}
                            type="text"
                            className="dropdown-input"
                            value={value === 'others' ? '' : value}
                            placeholder="Type a custom topic..."
                            onChange={(e) => onTextChange(e.target.value)}
                            onClick={handleInputClick}
                        />
                    ) : selectedOption ? (
                        <>
                            {selectedOption.emoji && <span className="dropdown-emoji">{selectedOption.emoji}</span>}
                            {selectedOption.name}
                        </>
                    ) : placeholder}
                </span>
                {!isEditable && (
                    <span className={`dropdown-chevron ${isOpen ? 'up' : 'down'}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </span>
                )}
            </div>

            {isOpen && !disabled && (
                <div className="dropdown-menu">
                    {options.map((option, index) => (
                        <React.Fragment key={option.id}>
                            <div
                                className={`dropdown-item ${value === option.id ? 'selected' : ''}`}
                                onClick={() => handleSelect(option)}
                            >
                                {option.emoji && <span className="dropdown-emoji">{option.emoji}</span>}
                                {option.name}
                            </div>
                            {index < options.length - 1 && <div className="dropdown-divider" />}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
}
