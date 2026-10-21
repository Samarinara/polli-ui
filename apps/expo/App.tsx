import * as React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  PolliProvider,
  Text,
  Button,
  Field,
  Input,
  Textarea,
  NativeSelect,
  Badge,
  Checkbox,
  Switch,
  Surface,
  Separator,
  Avatar,
  ListRow,
  Alert,
  EmptyState,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  AnimatedIcon,
  InkText,
  InkRemoval,
} from "@samarinara/polli-ui";

export default function App() {
  const [dark, setDark] = React.useState(false);
  return (
    <SafeAreaProvider>
      <PolliProvider mode={dark ? "dark" : "light"}>
        <SafeAreaView style={{ flex: 1 }}>
          <Gallery dark={dark} setDark={setDark} />
        </SafeAreaView>
      </PolliProvider>
    </SafeAreaProvider>
  );
}
function Gallery({
  dark,
  setDark,
}: {
  dark: boolean;
  setDark: (value: boolean) => void;
}) {
  const [name, setName] = React.useState("A small thought");
  const [checked, setChecked] = React.useState(false);
  const [saved, setSaved] = React.useState(0);
  const [removed, setRemoved] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const [category, setCategory] = React.useState("thoughts");
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 24,
        gap: 24,
        maxWidth: 720,
        width: "100%",
        alignSelf: "center",
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="heading">Polli UI</Text>
      <Text>One component library for web, iOS, and Android.</Text>
      <ListRow
        title="Dark mode"
        trailing={
          <Switch
            accessibilityLabel="Dark mode"
            checked={dark}
            onCheckedChange={setDark}
          />
        }
      />
      <Surface>
        <Text variant="heading">Your little collection</Text>
        <Field label="Title" description="Keep it in your own words.">
          <Input value={name} onChangeText={setName} />
        </Field>
        <Field label="A thought">
          <Textarea placeholder="What would you like to remember?" />
        </Field>
        <Field label="Collection">
          <NativeSelect
            options={[
              { value: "thoughts", label: "Thoughts" },
              { value: "recipes", label: "Recipes" },
            ]}
            value={category}
            onValueChange={(value) => value && setCategory(value)}
          />
        </Field>
        <Badge tone="butter">{category}</Badge>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <Checkbox
            accessibilityLabel="Keep for later"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <Text>Keep for later</Text>
        </View>
        <Button onPress={() => setSaved((value) => value + 1)}>
          <AnimatedIcon name="bookmark" actionKey={saved} color="#FAFBF6" />
          <InkText underlineKey={saved} style={{ color: "#FAFBF6" }}>
            Save
          </InkText>
        </Button>
      </Surface>
      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="people" inkTone="sky">
            People
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <ListRow
            title={name}
            description="Something worth remembering"
            trailing={<Badge>Private</Badge>}
          />
        </TabsContent>
        <TabsContent value="people">
          <ListRow
            leading={<Avatar name="Sam Katevatis" />}
            title="Sam Katevatis"
            description="Your collection"
          />
        </TabsContent>
      </Tabs>
      <Accordion type="single" collapsible>
        <AccordionItem value="about">
          <AccordionTrigger>What is Polli?</AccordionTrigger>
          <AccordionContent>
            A place for the things you care about.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Keep this thought?</DialogTitle>
          <DialogDescription>Your collection is private.</DialogDescription>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Collection actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onPress={() => setSaved((value) => value + 1)}>
            Save collection
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Sharing is coming later</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="sky" accessibilityLabel="About your collection">
            About
          </Button>
        </TooltipTrigger>
        <TooltipContent>On mobile, press and hold for help.</TooltipContent>
      </Tooltip>
      <Alert title="Saved in your collection">
        You can come back to it anytime.
      </Alert>
      <Separator />
      {visible ? (
        <InkRemoval removed={removed} onExitComplete={() => setVisible(false)}>
          <Button variant="coral" onPress={() => setRemoved(true)}>
            Remove this example
          </Button>
        </InkRemoval>
      ) : (
        <Button
          variant="secondary"
          onPress={() => {
            setRemoved(false);
            setVisible(true);
          }}
        >
          Restore example
        </Button>
      )}
      <Skeleton style={{ width: 160 }} />
      <EmptyState
        title="Room for a little more"
        description="Capture a thought, photo, or link."
      />
    </ScrollView>
  );
}
