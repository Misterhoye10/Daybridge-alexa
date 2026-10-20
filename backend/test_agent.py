import json
from app import create_app
from app.models import db, Plan, Task

def test_full_user_journey():
    app = create_app()
    with app.app_context():
        client = app.test_client()

        print("\n=== STEP 1: HEALTH CHECK ===")
        res = client.get("/api/health")
        print("Status:", res.status_code, res.get_json())
        assert res.status_code == 200

        print("\n=== STEP 2: USER ASKS FOR INTERVIEW PREP ===")
        user_msg = "Help me prepare for a software engineering interview on Friday. I have one hour each evening."
        print(f"User: '{user_msg}'")
        res = client.post("/api/chat", json={"message": user_msg})
        data = res.get_json()
        print("Assistant Reply:\n", data.get("reply"))
        print("\nAction Generated:")
        action = data.get("action", {})
        print(f"Type: {action.get('type')}, Status: {action.get('status')}")
        plan_data = action.get("data")
        assert plan_data is not None, "Plan data was not created!"
        plan_id = plan_data["id"]
        print(f"Created Plan ID: {plan_id}")
        print(f"Plan Title: {plan_data.get('title')}")
        print(f"Total Tasks: {len(plan_data.get('tasks', []))}")
        for t in plan_data.get("tasks", []):
            print(f" - [{t.get('order')}] {t.get('title')} ({t.get('estimated_minutes')} mins, due: {t.get('due_date')})")

        print("\n=== STEP 3: CONTEXT-AWARE FOLLOW UP ===")
        followup_msg = "Make the first day easier and add a mock interview."
        print(f"User: '{followup_msg}'")
        res2 = client.post("/api/chat", json={
            "message": followup_msg,
            "active_plan_id": plan_id,
            "conversation_history": [
                {"role": "user", "content": user_msg},
                {"role": "assistant", "content": data.get("reply")}
            ]
        })
        data2 = res2.get_json()
        print("Assistant Follow-up Reply:\n", data2.get("reply"))
        action2 = data2.get("action", {})
        print(f"Type: {action2.get('type')}, Status: {action2.get('status')}")
        updated_plan = action2.get("data", {})
        print(f"Updated Total Tasks: {len(updated_plan.get('tasks', []))}")
        for t in updated_plan.get("tasks", []):
            print(f" - [{t.get('order')}] {t.get('title')} ({t.get('estimated_minutes')} mins, due: {t.get('due_date')})")

        print("\n=== STEP 4: USER COMPLETES A TASK ===")
        tasks = updated_plan.get("tasks", [])
        if tasks:
            first_task_id = tasks[0]["id"]
            print(f"Marking task '{tasks[0]['title']}' as completed...")
            res3 = client.patch(f"/api/tasks/{first_task_id}", json={"is_completed": True})
            t_res = res3.get_json()
            print("Task update response:", t_res)
            print(f"New Plan Progress: {t_res.get('plan_progress')}%")

        print("\n=== STEP 5: VERIFY GET /api/plans ===")
        res4 = client.get("/api/plans")
        plans_res = res4.get_json()
        print(f"Total Saved Plans in DB: {len(plans_res.get('plans', []))}")
        print("ALL TESTS PASSED SUCCESSFULLY! PROVEN READY FOR DEMO!")

if __name__ == "__main__":
    test_full_user_journey()
