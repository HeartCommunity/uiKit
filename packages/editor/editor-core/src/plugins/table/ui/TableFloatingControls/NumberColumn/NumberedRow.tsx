import * as React from 'react';
import { StyledNumberedRow } from './styles';

export interface NumberedRowProps {
  row: number;
  rowElements: HTMLElement[];
  isRowActive?: boolean;
  isRowDanger?: boolean;
  tableActive?: boolean;

  selectRow: (row: number) => void;
  hoverRows: (rows: number[], danger?: boolean) => void;
  resetHoverSelection: () => void;

  children?: React.ReactNode;
}

export class NumberedRow extends React.Component<NumberedRowProps> {
  private onClick = () =>
    this.props.tableActive ? this.props.selectRow(this.props.row) : null;
  private onMouseOver = () =>
    this.props.tableActive ? this.props.hoverRows([this.props.row]) : null;
  private onMouseOut = () => {
    if (this.props.tableActive) {
      this.props.resetHoverSelection();
    }
  };

  render() {
    const { row, rowElements, isRowActive, isRowDanger } = this.props;

    return (
      <StyledNumberedRow
        style={{
          height: (rowElements[row] as HTMLElement).offsetHeight + 1,
        }}
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        className={[
          'numbered-row',
          isRowActive ? 'active' : '',
          isRowDanger ? 'danger' : '',
        ].join(' ')}
      >
        {this.props.children}
      </StyledNumberedRow>
    );
  }
}
