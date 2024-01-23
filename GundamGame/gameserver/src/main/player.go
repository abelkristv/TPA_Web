package main

type PlayerState int

// const (
// 	Idle PlayerState = iota
// 	Backward
// 	FrontKick
// 	Jump
// 	LowKick
// 	Walking
// )

type Player struct {
	X                   int
	Y                   int
	Width               int
	Height              int
	XSpeed              int
	YSpeed              int
	Health              int
	Type                string
	MaxHealth           int
	State               string
	Id                  string
	Lock                bool
	Mustlock            bool
	LastFrameChangeTime float64
	CurrentFrame        int
}

type PlayerJSON struct {
	X         int    `json:"x"`
	Y         int    `json:"y"`
	Width     int    `json:"width"`
	Height    int    `json:"height"`
	XSpeed    int    `json:"xSpeed"`
	YSpeed    int    `json:"ySpeed"`
	Health    int    `json:"health"`
	Type      string `json:"type"`
	MaxHealth int    `json:"maxHealth"`
	Id        string `json:"id"`
	State     struct {
		State               string  `json:"state"`
		Lock                bool    `json:"lock"`
		MustLock            bool    `json:"mustLock"`
		CurrentFrame        int     `json:"currentFrame"`
		FrameDuration       int     `json:"frameDuration"`
		LastFrameChangeTime float64 `json:"lastFrameChangeTime"`
	} `json:"state"`
}

func (p *Player) SetX(x int) {
	p.X = x
}

func (p *Player) SetY(y int) {
	p.Y = y
}

func (p *Player) SetWidth(width int) {
	p.Width = width
}

func (p *Player) SetHeight(height int) {
	p.Height = height
}

func (p *Player) SetXSpeed(xSpeed int) {
	p.XSpeed = xSpeed
}

func (p *Player) SetYSpeed(ySpeed int) {
	p.YSpeed = ySpeed
}

func (p *Player) SetHealth(health int) {
	p.Health = health
}

func (p *Player) SetMaxHealth(maxHealth int) {
	p.MaxHealth = maxHealth
}

func (p *Player) SetState(state string) {
	p.State = state
}

func (p *Player) SetLock(lock bool) {
	p.Lock = lock
}

func (p *Player) SetMustLock(mustlock bool) {
	p.Mustlock = mustlock
}

func (p *Player) SetLastFrameChangeTime(lastFrameChangeTime float64) {
	p.LastFrameChangeTime = lastFrameChangeTime
}

func (p *Player) SetCurrentFrame(currentFrame int) {
	p.CurrentFrame = currentFrame
}
