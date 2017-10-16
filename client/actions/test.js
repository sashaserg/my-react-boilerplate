import { createActionAsync } from 'redux-act-async';

const actions =
	{
		testAction: (() => {
			function testAction(payload) {
				return {
					type: testAction.type,
					payload: payload
				};
			}

			testAction.type = 'TEST_ACTION';
			return testAction;
		})(),

		testActionAsync: createActionAsync('TEST_ACTION_ASYNC', () => {
			return (Promise.resolve()).then( () => { return {field:"field"} } );
		})
	};

export default actions;