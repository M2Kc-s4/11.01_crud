import { DomainError } from "@shared/error"
import { Serializable } from "nucleus-mold"
import { ID } from "@domain/common/value-objects/id"
import type User from "@domain/identity/user"
import HashMap from "@domain/common/value-objects/hash-map"
import { equals } from "@shared/lib"
import type Topic from "./topic"


export const ErrAnswerLength = new DomainError("ANSWER_TEXT_LENGTH", "ANSWER_TEXT_LENGTH")
export const ErrQuestionTextLength = new DomainError("QUESTION_TEXT_LENGTH", "QUESTION_TEXT_LENGTH")
export const ErrQuestionAnswersCount = new DomainError("QUESTION_ANSWERS_COUNT", "QUESTION_ANSWERS_COUNT")
export const ErrQuestionNoCorrectAnswer = new DomainError("QUESTION_NO_CORRECT_ANSWER", "QUESTION_NO_CORRECT_ANSWER")


@Serializable()
export class AnswerText {
    constructor(private v: string) {}

    static from(text: string) {
        if (text.length < 8 || text.length > 64) throw ErrAnswerLength

        return new AnswerText(text)
    }
}


@Serializable()
export class CorrectStatus {
    constructor(private v: boolean) {}

    static get Correct() { return new CorrectStatus(true) }

    static get Wrong() { return new CorrectStatus(false) }

    isCorrect() { return this.v }
    isWrong() { return !this.v}
}


@Serializable()
export class Answer {
    constructor(
        readonly id: ID<Answer>,
        private _text: AnswerText,
        private _correctness: CorrectStatus
    ) {}

    static create(text: AnswerText, status: CorrectStatus) {
        return new Answer(ID.generate(), text, status)
    }

    get correctness() { return this._correctness }
}


@Serializable()
export class QuestionText {
    constructor(private v: string) {}

    static from(text: string) {
        if (text.length < 8 || text.length > 128) throw ErrQuestionTextLength

        return new QuestionText(text)
    }
}


@Serializable()
export default class Question {
    constructor(
        readonly id: ID<Question>,
        private _text: QuestionText,
        private _byTopic: ID<Topic>,
        private _createdBy: ID<User>,
        private _answers: HashMap<ID<Answer>, Answer>
    ) {}


    static create(text: QuestionText, createdBy: ID<User>, byTopic: ID<Topic>, answers: Answer[]) {
        if (answers.length < 2) throw ErrQuestionAnswersCount

        if (!answers.some(a =>
            a.correctness.isCorrect()
        )) throw ErrQuestionNoCorrectAnswer

        return new Question(
            ID.generate(),
            text,
            byTopic,
            createdBy,
            HashMap.fromEntries(answers.map(a => [a.id, a]))
        )
    }


    checkAnswers(selectedAnswerIDs: ID<Answer>[]) {
        const correctAnswers = this._answers.values()
            .filter(answer => answer.correctness.isCorrect())

        if (selectedAnswerIDs.length !== correctAnswers.length) return false

        return correctAnswers.every(correctAnswer =>
            selectedAnswerIDs.some(selectedID => equals(correctAnswer.id, selectedID))
        )
    }
}
