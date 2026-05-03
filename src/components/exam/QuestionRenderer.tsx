"use client";

import type { DerivedQuestion } from "@/helpers/exam/examShuffle";

interface Props {
  question: DerivedQuestion;
  questionIndex: number;
  userAnswer: string | undefined;
  onAnswer: (index: number, value: string) => void;
  disabled?: boolean;
}

export default function QuestionRenderer({
  question,
  questionIndex,
  userAnswer,
  onAnswer,
  disabled = false,
}: Props) {
  switch (question.kind) {
    case "mcq":
      return (
        <MCQOptions
          options={question.options}
          userAnswer={userAnswer}
          onAnswer={(val) => onAnswer(questionIndex, val)}
          disabled={disabled}
        />
      );

    case "pictorial_mcq":
      return (
        <>
          <div className="mb-5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={question.image}
              alt="Question illustration"
              className="w-full max-h-72 object-contain bg-white dark:bg-slate-900 p-2"
            />
          </div>
          <MCQOptions
            options={question.options}
            userAnswer={userAnswer}
            onAnswer={(val) => onAnswer(questionIndex, val)}
            disabled={disabled}
          />
        </>
      );

    case "true_false":
      return (
        <div className="flex gap-3">
          {(["True", "False"] as const).map((opt) => {
            const isSelected = userAnswer === opt;
            return (
              <button
                key={opt}
                onClick={() => !disabled && onAnswer(questionIndex, opt)}
                disabled={disabled}
                className={`flex-1 py-4 rounded-xl border text-sm font-bold transition-all ${
                  isSelected
                    ? opt === "True"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-sm"
                      : "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 shadow-sm"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500"
                }`}
              >
                {opt === "True" ? "True" : "False"}
              </button>
            );
          })}
        </div>
      );

    case "fill_in":
      return (
        <FillInInput
          value={userAnswer ?? ""}
          question={question.question}
          answerType={question.answerType ?? "text"}
          answerMin={"answerMin" in question ? question.answerMin : undefined}
          answerMax={"answerMax" in question ? question.answerMax : undefined}
          onChange={(val) => onAnswer(questionIndex, val)}
          disabled={disabled}
        />
      );

    default:
      return null;
  }
}

function MCQOptions({
  options,
  userAnswer,
  onAnswer,
  disabled,
}: {
  options: string[];
  userAnswer: string | undefined;
  onAnswer: (val: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-3">
      {options.map((opt, i) => {
        const isSelected = userAnswer === opt;
        const label = String.fromCharCode(65 + i);

        return (
          <button
            key={opt}
            onClick={() => !disabled && onAnswer(opt)}
            disabled={disabled}
            className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all ${
              isSelected
                ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-sm shadow-blue-100 dark:shadow-none"
                : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-300 dark:hover:border-slate-500 hover:bg-white dark:hover:bg-slate-700/50"
            }`}
          >
            <span
              className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                isSelected
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
              }`}
            >
              {label}
            </span>
            <span
              className={`text-sm leading-snug transition-colors ${
                isSelected
                  ? "text-blue-700 dark:text-blue-300 font-medium"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FillInInput({
  value,
  answerType = "text",
  //   answerMin,
  //   answerMax,
  onChange,
  disabled,
}: {
  value: string;
  question: string;
  answerType?: "text" | "number" | "range";
  answerMin?: number;
  answerMax?: number;
  onChange: (val: string) => void;
  disabled: boolean;
}) {
  const isNumeric = answerType === "number" || answerType === "range";

  const numericValue = isNumeric ? parseFloat(value) : NaN;
  const isEmpty = value.trim() === "";
  const isInvalidNumber = isNumeric && !isEmpty && isNaN(numericValue);

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-50 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 ${
    isInvalidNumber
      ? "border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-500/20"
      : "border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-500/20"
  }`;

  const placeholder = isNumeric ? "Enter a number…" : "Type your answer…";

  //   const rangeHint =
  //     answerType === "range" && answerMin !== undefined && answerMax !== undefined
  //       ? `Accepted range: ${answerMin} - ${answerMax}`
  //       : null;

  return (
    <div className="space-y-2">
      <input
        type={isNumeric ? "number" : "text"}
        inputMode={isNumeric ? "decimal" : "text"}
        step={isNumeric ? "any" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClass}
      />
      {isInvalidNumber && (
        <p className="text-xs text-red-500 dark:text-red-400 pl-1">
          Please enter a valid number.
        </p>
      )}
      {/* {rangeHint && (
        <p className="text-xs text-slate-400 dark:text-slate-500 pl-1">
          {rangeHint}
        </p>
      )} */}
    </div>
  );
}
