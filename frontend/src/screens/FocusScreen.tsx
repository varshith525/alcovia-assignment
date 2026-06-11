import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  AppState,
} from "react-native";

import {
  saveData,
  getData,
  getDeviceId,
  saveOperation,
  setCurrentDevice,
} from "../storage/storage";

import { syncOperations } from "../utils/api";

export default function FocusScreen() {
  const [seconds, setSeconds] = useState(25);
  const [running, setRunning] = useState(false);

  const [sessions, setSessions] = useState<any[]>([]);
  const [operations, setOperations] = useState<any[]>([]);

  const [deviceId, setDeviceId] = useState("");
  const [activeDevice, setActiveDevice] =
    useState("deviceA");

  const [isOnline, setIsOnline] =
    useState(false);

  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [focusMinutes, setFocusMinutes] =
    useState(0);

  useEffect(() => {
    loadSessions();
  }, []);

  const switchDevice = async (
    device: string
  ) => {
    setCurrentDevice(device);
    setActiveDevice(device);

    await loadSessions();

    console.log(
      "SWITCHED TO:",
      device
    );
  };

  const loadSessions = async () => {
    const savedSessions =
      (await getData("sessions")) || [];

    const savedOperations =
      (await getData("operations")) || [];

    const id = await getDeviceId();

    setSessions(savedSessions);
    setOperations(savedOperations);
    setDeviceId(id);
  };

  const saveSession = async (
    status: string
  ) => {
    const existing =
      (await getData("sessions")) || [];

    const deviceId =
      await getDeviceId();

    const session = {
      id: Date.now().toString(),
      deviceId,
      status,
      createdAt: Date.now(),
      synced: false,
    };

    const updated = [
      ...existing,
      session,
    ];

    await saveData(
      "sessions",
      updated
    );

    await saveOperation({
      id: session.id,
      type: "focus_session",
      deviceId,
      status,
      synced: false,
    });

    await loadSessions();

    console.log("Saved:", session);
  };

  const handleSync = async () => {
    try {
      const ops =
        (await getData("operations")) || [];

      const result =
        await syncOperations(ops);

      setCoins(result.userState.coins);
      setStreak(result.userState.streak);
      setFocusMinutes(
        result.userState.todayFocusMinutes
      );

      console.log(
        "SYNC RESULT:",
        result
      );
    } catch (error) {
      console.error(
        "SYNC FAILED:",
        error
      );
    }
  };

  const showOperations =
    async () => {
      const ops =
        (await getData(
          "operations"
        )) || [];

      console.log(
        JSON.stringify(
          ops,
          null,
          2
        )
      );
    };

  useEffect(() => {
    let timer: any;

    if (running && seconds > 0) {
      timer = setInterval(() => {
        setSeconds(
          (prev) => prev - 1
        );
      }, 1000);
    }

    if (
      seconds === 0 &&
      running
    ) {
      setRunning(false);
      saveSession("success");
    }

    return () =>
      clearInterval(timer);
  }, [running, seconds]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#f4f6f8",
      }}
    >
      <View style={{ padding: 20 }}>
        {/* Header */}

        <View
          style={{
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            🎯 Alcovia
          </Text>

          <Text
            style={{
              color: "#666",
            }}
          >
            Offline First Study Platform
          </Text>
        </View>

        {/* Device Card */}

        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 15,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Active Device
          </Text>

          <Text>{activeDevice}</Text>

          <Text
            style={{
              color: "#666",
              marginTop: 5,
            }}
          >
            {deviceId}
          </Text>
        </View>

        {/* Dashboard */}

        <View
          style={{
            backgroundColor:
              "#2563eb",
            padding: 20,
            borderRadius: 15,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
            Dashboard Summary
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 28,
                  fontWeight:
                    "bold",
                }}
              >
                {coins}
              </Text>

              <Text
                style={{
                  color: "#fff",
                }}
              >
                Coins
              </Text>
            </View>

            <View>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 28,
                  fontWeight:
                    "bold",
                }}
              >
                {streak}
              </Text>

              <Text
                style={{
                  color: "#fff",
                }}
              >
                Streak
              </Text>
            </View>

            <View>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 28,
                  fontWeight:
                    "bold",
                }}
              >
                {focusMinutes}
              </Text>

              <Text
                style={{
                  color: "#fff",
                }}
              >
                Minutes
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}

        <View
          style={{
            flexDirection: "row",
            justifyContent:
              "space-between",
            marginBottom: 15,
          }}
        >
          <View
            style={{
              backgroundColor:
                "#fff",
              width: "48%",
              padding: 20,
              borderRadius: 15,
            }}
          >
            <Text>Sessions</Text>

            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
              }}
            >
              {sessions.length}
            </Text>
          </View>

          <View
            style={{
              backgroundColor:
                "#fff",
              width: "48%",
              padding: 20,
              borderRadius: 15,
            }}
          >
            <Text>Operations</Text>

            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
              }}
            >
              {operations.length}
            </Text>
          </View>
        </View>

        {/* Status */}

        <View
          style={{
            backgroundColor:
              "#fff",
            padding: 20,
            borderRadius: 15,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
            }}
          >
            {isOnline
              ? "🟢 Online"
              : "🔴 Offline"}
          </Text>
        </View>

        {/* Device Switch */}

        <View
          style={{
            backgroundColor:
              "#fff",
            padding: 20,
            borderRadius: 15,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
            Multi Device Testing
          </Text>

          <Button
            title="Switch To Device A"
            onPress={() =>
              switchDevice(
                "deviceA"
              )
            }
          />

          <View
            style={{
              height: 10,
            }}
          />

          <Button
            title="Switch To Device B"
            onPress={() =>
              switchDevice(
                "deviceB"
              )
            }
          />
        </View>

        {/* Timer */}

        <View
          style={{
            backgroundColor:
              "#fff",
            padding: 20,
            borderRadius: 15,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
            }}
          >
            Focus Session
          </Text>

          <Text
            style={{
              fontSize: 60,
              fontWeight: "bold",
              textAlign: "center",
              marginVertical: 20,
            }}
          >
            {seconds}
          </Text>

          <View
            style={{
              height: 12,
              backgroundColor:
                "#ddd",
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                height: 12,
                width: `${(seconds / 25) * 100}%`,
                backgroundColor:
                  "#22c55e",
                borderRadius: 10,
              }}
            />
          </View>

          {!running ? (
            <TouchableOpacity
              style={{
                backgroundColor:
                  "#2563eb",
                padding: 15,
                borderRadius: 10,
                alignItems:
                  "center",
              }}
              onPress={() => {
                setSeconds(25);
                setRunning(true);
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight:
                    "bold",
                }}
              >
                START SESSION
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor:
                  "#ef4444",
                padding: 15,
                borderRadius: 10,
                alignItems:
                  "center",
              }}
              onPress={() => {
                setRunning(false);
                saveSession(
                  "failed"
                );
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight:
                    "bold",
                }}
              >
                GIVE UP
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recent Sessions */}

        <View
          style={{
            backgroundColor:
              "#fff",
            padding: 20,
            borderRadius: 15,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Recent Sessions
          </Text>

          {sessions
            .slice(-5)
            .reverse()
            .map((session) => (
              <Text
                key={session.id}
              >
                {session.status ===
                "success"
                  ? "✅ Success"
                  : "❌ Failed"}
              </Text>
            ))}
        </View>

        {/* Actions */}

        <View
          style={{
            backgroundColor:
              "#fff",
            padding: 20,
            borderRadius: 15,
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
            Sync Actions
          </Text>

          <Button
            title="Sync Now"
            onPress={handleSync}
          />

          <View
            style={{
              height: 10,
            }}
          />

          <Button
            title="Show Operations"
            onPress={
              showOperations
            }
          />

          <View
            style={{
              height: 10,
            }}
          />

          <Button
            title={
              isOnline
                ? "Go Offline"
                : "Go Online"
            }
            onPress={() =>
              setIsOnline(
                !isOnline
              )
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}