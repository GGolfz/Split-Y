import { t } from "elysia"

export interface LineMessageEvent {
	destination: string
	events: Array<Event>
}

export interface Event {
	type: string
	message: Message
	timestamp: number
	source: Source
	replyToken: string
}

export interface Message {
	type: string
	id: string
	quoteToken: string
	text: string
}

export interface DeliveryContext {
	isRedelivery: boolean
}

export interface Source {
	type: string
	userId: string
    groupId: string
}

export const LineMessageEventType = t.Object({
	destination: t.String(),
	events: t.Array(
	  t.Object({
		type: t.String(),
		message: t.Object({
		  type: t.String(),
		  id: t.String(),
		  quoteToken: t.String(),
		  text: t.String(),
		}),
		timestamp: t.Number(),
		source: t.Object({
		  type: t.String(),
		  userId: t.String(),
		  groupId: t.String(),
		}),
		replyToken: t.String()
	  })
	),
  })