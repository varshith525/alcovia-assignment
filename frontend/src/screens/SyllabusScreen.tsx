import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
} from "react-native";
import {
  getData,
  saveData,
  getDeviceId,
  saveOperation,
} from "../storage/storage";

const DEFAULT_SUBJECTS = [
  {
    id: "math",
    name: "Math",
    tasks: [
      {
        id: "m1",
        name: "Algebra",
        status: "not_started",
      },
      {
        id: "m2",
        name: "Geometry",
        status: "not_started",
      },
    ],
  },
  {
    id: "science",
    name: "Science",
    tasks: [
      {
        id: "s1",
        name: "Physics",
        status: "not_started",
      },
      {
        id: "s2",
        name: "Chemistry",
        status: "not_started",
      },
    ],
  },
];

export default function SyllabusScreen() {
  const [subjects, setSubjects] =
    useState<any[]>([]);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const saved =
      (await getData("subjects")) ||
      DEFAULT_SUBJECTS;

    setSubjects(saved);
  };

  const updateTask = async (
    subjectId: string,
    taskId: string,
    status: string
  ) => {
    const updated = subjects.map(
      (subject) => {
        if (
          subject.id !== subjectId
        )
          return subject;

        return {
          ...subject,
          tasks: subject.tasks.map(
            (task: any) =>
              task.id === taskId
                ? {
                    ...task,
                    status,
                  }
                : task
          ),
        };
      }
    );

    setSubjects(updated);

    await saveData(
      "subjects",
      updated
    );

    const deviceId =
      await getDeviceId();

    await saveOperation({
      id: Date.now().toString(),
      type: "task_update",
      subjectId,
      taskId,
      status,
      deviceId,
      version: Date.now(),
    });
  };

  const totalTasks =
    subjects.reduce(
      (sum, subject) =>
        sum + subject.tasks.length,
      0
    );

  const completedTasks =
    subjects.reduce(
      (sum, subject) =>
        sum +
        subject.tasks.filter(
          (t: any) =>
            t.status === "done"
        ).length,
      0
    );

  const overallProgress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor:
          "#f4f6f8",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        📚 Study Progress
      </Text>

      {/* Overall Progress Card */}

      <View
        style={{
          backgroundColor:
            "#ffffff",
          padding: 20,
          borderRadius: 15,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          Overall Progress
        </Text>

        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginVertical: 10,
          }}
        >
          {overallProgress}%
        </Text>

        <View
          style={{
            height: 12,
            backgroundColor:
              "#ddd",
            borderRadius: 10,
          }}
        >
          <View
            style={{
              height: 12,
              width: `${overallProgress}%`,
              backgroundColor:
                "#22c55e",
              borderRadius: 10,
            }}
          />
        </View>

        <Text
          style={{
            marginTop: 10,
          }}
        >
          {completedTasks} of{" "}
          {totalTasks} tasks completed
        </Text>
      </View>

      {/* Subjects */}

      {subjects.map((subject) => {
        const completed =
          subject.tasks.filter(
            (t: any) =>
              t.status === "done"
          ).length;

        const progress =
          Math.round(
            (completed /
              subject.tasks.length) *
              100
          );

        return (
          <View
            key={subject.id}
            style={{
              backgroundColor:
                "#ffffff",
              padding: 20,
              borderRadius: 15,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
              }}
            >
              {subject.name}
            </Text>

            <Text
              style={{
                marginVertical: 10,
              }}
            >
              Progress: {progress}%
            </Text>

            <View
              style={{
                height: 10,
                backgroundColor:
                  "#ddd",
                borderRadius: 10,
                marginBottom: 15,
              }}
            >
              <View
                style={{
                  width: `${progress}%`,
                  height: 10,
                  backgroundColor:
                    "#2563eb",
                  borderRadius: 10,
                }}
              />
            </View>

            {subject.tasks.map(
              (task: any) => (
                <View
                  key={task.id}
                  style={{
                    backgroundColor:
                      "#f8fafc",
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontWeight:
                        "600",
                    }}
                  >
                    {task.name}
                  </Text>

                  <Text
                    style={{
                      marginVertical: 5,
                    }}
                  >
                    Status:
                    {" "}
                    {task.status ===
                    "done"
                      ? "✅ Done"
                      : "⏳ Not Started"}
                  </Text>

                  <Button
                    title="Mark Done"
                    onPress={() =>
                      updateTask(
                        subject.id,
                        task.id,
                        "done"
                      )
                    }
                  />
                </View>
              )
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}