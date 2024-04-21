import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button, Typography } from '@mui/material';
import config from '@config';
import { useAtom, useSetAtom } from 'jotai';
import { canGoNextAtom, inputIdsAtom, recommendButtonDisabledAtom } from '../store';

function ReferencesInput() {
    const [inputIds, setInputIds] = useAtom(inputIdsAtom);
    const [inputValue, setInputValue] = useState('');
    const [buttonDisabled, setButtonDisabled] = useAtom(recommendButtonDisabledAtom);
    const setCanGoNext = useSetAtom(canGoNextAtom);

    useEffect(() => {
      if (inputIds.length === 0) {
        setCanGoNext(false);

        if (buttonDisabled) {
          setButtonDisabled(false);
        }
      } else {
        setCanGoNext(true);
      }
    }, [inputIds]);

    const handleUseRecommended = () => {
      const newIds = [...new Set([...inputIds, ...config.seedReferencesIds])];
      setInputIds(newIds);
      setButtonDisabled(true);
    };
    
    const handleBlur = (event, newValue, reason) => {
      setInputValue(newValue);
    }

    const splitAndAddOptions = (options) => {
      const newOptions = options
        .split(/[\s,]+/)
        .map((option) => option.trim())
        .filter((option) => option.length > 0);
      const newIds = [...new Set([...inputIds, ...newOptions])];
      setInputIds(newIds);
    }

    const handleChange = (event, newValue, reason, details) => {
      if ("blur" === reason) {
        splitAndAddOptions(event.target.value)
        setInputValue('');
      }

      if ("createOption" === reason) {
        splitAndAddOptions(details.option)
      }

      if ("removeOption" === reason) {
        const newOptions = inputIds.filter((option) => option !== details.option);
        setInputIds(newOptions);
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5rem' }}>
        <Typography 
          style={{ color: '#a1a1a1', marginBottom: '2rem'}}
          variant="h3">
          Add References
        </Typography>
        <Typography>
          List some ids of arXiv papers to be used when ranking papers.
        </Typography>
        <Typography>
          You can paste a list of ids separated by commas or spaces.
        </Typography>

        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column' }}>

          <Autocomplete
            multiple
            freeSolo
            sx={{ width: 565, maxWidth: 565 }}
            id="seed-references"
            disableClearable
            options={[]}
            limitTags={20}
            value={inputIds}
            inputValue={inputValue}
            onChange={handleChange}
            onInputChange={handleBlur}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter Reference Ids"
                variant="outlined"
                // sx={{ display:  justifyContent: 'center'}}
                onBlur={(event) => handleChange(event, params.InputProps, 'blur', {})}
                InputProps={{
                  ...params.InputProps,
                  sx: {  borderBottomLeftRadius: 0, borderBottomRightRadius: 0, minHeight: 183 },
                  type: 'search'
                }}
              />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUseRecommended}
            disabled={buttonDisabled}
            sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            >
            Use recommended
          </Button>
        </div>

      </div>
    );
}

export default ReferencesInput;
