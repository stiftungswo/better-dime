import { FieldArrayRenderProps } from 'formik';
import { DragDropContext, Draggable, DraggableProvided, DraggableStateSnapshot, Droppable, DropResult } from 'react-beautiful-dnd';
import * as React from 'react';
import { RootRef } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';

interface Props<T> {
  arrayHelpers: FieldArrayRenderProps;
  renderRow: (
    props: {
      row: T;
      index: number;
      provided: DraggableProvided;
      snapshot: DraggableStateSnapshot;
    }
  ) => React.ReactNode;
  name: string;
  orderField?: string;
}

export const DraggableTableBody = <T extends { id?: number; formikKey?: number }>({
  arrayHelpers,
  renderRow,
  name,
  orderField = 'order',
}: Props<T>) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    arrayHelpers.move(result.source.index, result.destination.index);
    arrayHelpers.form.values[name].forEach((_: object, index: number) => {
      arrayHelpers.form.setFieldValue(`${name}.${index}.${orderField}`, index);
    });
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={'table'}>
        {(dropProvided, dropSnapshot) => (
          <RootRef rootRef={dropProvided.innerRef}>
            <TableBody>
              {arrayHelpers.form.values[name].map((row: T, index: number) => {
                const key = row.id || row.formikKey;
                return (
                  <Draggable key={key} draggableId={String(key)} index={index}>
                    {(provided, snapshot) => (
                      <RootRef rootRef={provided.innerRef}>
                        <TableRow key={key} {...provided.draggableProps}>
                          {renderRow({ row, index, provided, snapshot })}
                        </TableRow>
                      </RootRef>
                    )}
                  </Draggable>
                );
              })}
            </TableBody>
          </RootRef>
        )}
      </Droppable>
    </DragDropContext>
  );
};
