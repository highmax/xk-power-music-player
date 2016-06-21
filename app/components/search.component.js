// Import React
import React from 'react';

// Import React´s Autocomplete component
import Autocomplete from 'react-autocomplete';

// Create Search component class
class Search extends React.Component {

  handleRenderItem(item, isHighlighted){
    // Some basic style
    const listStyles = {
      item: {
        padding: '2px 6px',
        cursor: 'default'
      },

      highlightedItem: {
        color: 'white',
        background: '#F38B72',
        padding: '2px 6px',
        cursor: 'default'
      }
    };

    // Render list items
    return (
      <div
        style={isHighlighted ? listStyles.highlightedItem : listStyles.item}
        key={item.id}
        id={item.id}
      >{item.title}</div>
    )
  }

  // Return JSX via render()
  render() {
    return (
      <div className="search">
      {/*Autocomplete usage with value and behavior handled via this.props*/}
        <Autocomplete
         ref="autocomplete"
         inputProps={{title: "Title"}}
         value={this.props.autoCompleteValue}
         /*Array of tracks is passed in to items*/
         items={this.props.tracks}
         /*Single value selected*/
         getItemValue={(item) => item.title}
         /*What happens when an item is selected*/
         onSelect={this.props.handleSelect}
         /*What happens when keystrokes are received*/
         onChange={this.props.handleChange}
         /*How items are redered.*/
         renderItem={this.handleRenderItem.bind(this)}
       />
      </div>
    );
  }
}

//Export Search
export default Search
