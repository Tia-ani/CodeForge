import { sequelize, DataTypes, Model } from '../config/database';
import { Submission } from './Submission';

export interface TraceStep {
  line_number: number;
  variable_snapshots: Record<string, any>;
  call_stack_depth: number;
  function_name?: string;
}

export class SubmissionTrace extends Model {
  declare traceId: number;
  declare submissionId: number;
  declare traceData: string; // JSON string of TraceStep[]
  declare totalSteps: number;
  declare executionTime: number;
}

SubmissionTrace.init(
  {
    traceId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Submission,
        key: 'submissionId',
      },
      onDelete: 'CASCADE',
    },
    traceData: {
      type: DataTypes.TEXT('long'), // Store JSON as text
      allowNull: false,
    },
    totalSteps: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    executionTime: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'submission_traces',
    timestamps: true,
  }
);

Submission.hasOne(SubmissionTrace, { foreignKey: 'submissionId', as: 'trace' });
SubmissionTrace.belongsTo(Submission, { foreignKey: 'submissionId', as: 'submission' });
